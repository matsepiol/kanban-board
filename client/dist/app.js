"format register";
(function(global) {

  var defined = {};

  // indexOf polyfill for IE8
  var indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++)
      if (this[i] === item)
        return i;
    return -1;
  }

  function dedupe(deps) {
    var newDeps = [];
    for (var i = 0, l = deps.length; i < l; i++)
      if (indexOf.call(newDeps, deps[i]) == -1)
        newDeps.push(deps[i])
    return newDeps;
  }

  function register(name, deps, declare, execute) {
    if (typeof name != 'string')
      throw "System.register provided no module name";
    
    var entry;

    // dynamic
    if (typeof declare == 'boolean') {
      entry = {
        declarative: false,
        deps: deps,
        execute: execute,
        executingRequire: declare
      };
    }
    else {
      // ES6 declarative
      entry = {
        declarative: true,
        deps: deps,
        declare: declare
      };
    }

    entry.name = name;
    
    // we never overwrite an existing define
    if (!defined[name])
      defined[name] = entry; 

    entry.deps = dedupe(entry.deps);

    // we have to normalize dependencies
    // (assume dependencies are normalized for now)
    // entry.normalizedDeps = entry.deps.map(normalize);
    entry.normalizedDeps = entry.deps;
  }

  function buildGroups(entry, groups) {
    groups[entry.groupIndex] = groups[entry.groupIndex] || [];

    if (indexOf.call(groups[entry.groupIndex], entry) != -1)
      return;

    groups[entry.groupIndex].push(entry);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];
      
      // not in the registry means already linked / ES6
      if (!depEntry || depEntry.evaluated)
        continue;
      
      // now we know the entry is in our unlinked linkage group
      var depGroupIndex = entry.groupIndex + (depEntry.declarative != entry.declarative);

      // the group index of an entry is always the maximum
      if (depEntry.groupIndex === undefined || depEntry.groupIndex < depGroupIndex) {
        
        // if already in a group, remove from the old group
        if (depEntry.groupIndex !== undefined) {
          groups[depEntry.groupIndex].splice(indexOf.call(groups[depEntry.groupIndex], depEntry), 1);

          // if the old group is empty, then we have a mixed depndency cycle
          if (groups[depEntry.groupIndex].length == 0)
            throw new TypeError("Mixed dependency cycle detected");
        }

        depEntry.groupIndex = depGroupIndex;
      }

      buildGroups(depEntry, groups);
    }
  }

  function link(name) {
    var startEntry = defined[name];

    startEntry.groupIndex = 0;

    var groups = [];

    buildGroups(startEntry, groups);

    var curGroupDeclarative = !!startEntry.declarative == groups.length % 2;
    for (var i = groups.length - 1; i >= 0; i--) {
      var group = groups[i];
      for (var j = 0; j < group.length; j++) {
        var entry = group[j];

        // link each group
        if (curGroupDeclarative)
          linkDeclarativeModule(entry);
        else
          linkDynamicModule(entry);
      }
      curGroupDeclarative = !curGroupDeclarative; 
    }
  }

  // module binding records
  var moduleRecords = {};
  function getOrCreateModuleRecord(name) {
    return moduleRecords[name] || (moduleRecords[name] = {
      name: name,
      dependencies: [],
      exports: {}, // start from an empty module and extend
      importers: []
    })
  }

  function linkDeclarativeModule(entry) {
    // only link if already not already started linking (stops at circular)
    if (entry.module)
      return;

    var module = entry.module = getOrCreateModuleRecord(entry.name);
    var exports = entry.module.exports;

    var declaration = entry.declare.call(global, function(name, value) {
      module.locked = true;
      exports[name] = value;

      for (var i = 0, l = module.importers.length; i < l; i++) {
        var importerModule = module.importers[i];
        if (!importerModule.locked) {
          var importerIndex = indexOf.call(importerModule.dependencies, module);
          importerModule.setters[importerIndex](exports);
        }
      }

      module.locked = false;
      return value;
    });
    
    module.setters = declaration.setters;
    module.execute = declaration.execute;

    if (!module.setters || !module.execute)
      throw new TypeError("Invalid System.register form for " + entry.name);

    // now link all the module dependencies
    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      var depEntry = defined[depName];
      var depModule = moduleRecords[depName];

      // work out how to set depExports based on scenarios...
      var depExports;

      if (depModule) {
        depExports = depModule.exports;
      }
      else if (depEntry && !depEntry.declarative) {
        depExports = { 'default': depEntry.module.exports, __useDefault: true };
      }
      // in the module registry
      else if (!depEntry) {
        depExports = load(depName);
      }
      // we have an entry -> link
      else {
        linkDeclarativeModule(depEntry);
        depModule = depEntry.module;
        depExports = depModule.exports;
      }

      // only declarative modules have dynamic bindings
      if (depModule && depModule.importers) {
        depModule.importers.push(module);
        module.dependencies.push(depModule);
      }
      else
        module.dependencies.push(null);

      // run the setter for this dependency
      if (module.setters[i])
        module.setters[i](depExports);
    }
  }

  // An analog to loader.get covering execution of all three layers (real declarative, simulated declarative, simulated dynamic)
  function getModule(name) {
    var exports;
    var entry = defined[name];

    if (!entry) {
      exports = load(name);
      if (!exports)
        throw new Error("Unable to load dependency " + name + ".");
    }

    else {
      if (entry.declarative)
        ensureEvaluated(name, []);
    
      else if (!entry.evaluated)
        linkDynamicModule(entry);

      exports = entry.module.exports;
    }

    if ((!entry || entry.declarative) && exports && exports.__useDefault)
      return exports['default'];

    return exports;
  }

  function linkDynamicModule(entry) {
    if (entry.module)
      return;

    var exports = {};

    var module = entry.module = { exports: exports, id: entry.name };

    // AMD requires execute the tree first
    if (!entry.executingRequire) {
      for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
        var depName = entry.normalizedDeps[i];
        var depEntry = defined[depName];
        if (depEntry)
          linkDynamicModule(depEntry);
      }
    }

    // now execute
    entry.evaluated = true;
    var output = entry.execute.call(global, function(name) {
      for (var i = 0, l = entry.deps.length; i < l; i++) {
        if (entry.deps[i] != name)
          continue;
        return getModule(entry.normalizedDeps[i]);
      }
      throw new TypeError('Module ' + name + ' not declared as a dependency.');
    }, exports, module);
    
    if (output)
      module.exports = output;
  }

  /*
   * Given a module, and the list of modules for this current branch,
   *  ensure that each of the dependencies of this module is evaluated
   *  (unless one is a circular dependency already in the list of seen
   *  modules, in which case we execute it)
   *
   * Then we evaluate the module itself depth-first left to right 
   * execution to match ES6 modules
   */
  function ensureEvaluated(moduleName, seen) {
    var entry = defined[moduleName];

    // if already seen, that means it's an already-evaluated non circular dependency
    if (entry.evaluated || !entry.declarative)
      return;

    // this only applies to declarative modules which late-execute

    seen.push(moduleName);

    for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
      var depName = entry.normalizedDeps[i];
      if (indexOf.call(seen, depName) == -1) {
        if (!defined[depName])
          load(depName);
        else
          ensureEvaluated(depName, seen);
      }
    }

    if (entry.evaluated)
      return;

    entry.evaluated = true;
    entry.module.execute.call(global);
  }

  // magical execution function
  var modules = {};
  function load(name) {
    if (modules[name])
      return modules[name];

    var entry = defined[name];

    // first we check if this module has already been defined in the registry
    if (!entry)
      throw "Module " + name + " not present.";

    // recursively ensure that the module and all its 
    // dependencies are linked (with dependency group handling)
    link(name);

    // now handle dependency execution in correct order
    ensureEvaluated(name, []);

    // remove from the registry
    defined[name] = undefined;

    var module = entry.declarative ? entry.module.exports : { 'default': entry.module.exports, '__useDefault': true };

    // return the defined module object
    return modules[name] = module;
  };

  return function(main, declare) {

    var System;

    // if there's a system loader, define onto it
    if (typeof System != 'undefined' && System.register) {
      declare(System);
      System['import'](main);
    }
    // otherwise, self execute
    else {
      declare(System = {
        register: register, 
        get: load, 
        set: function(name, module) {
          modules[name] = module; 
        },
        newModule: function(module) {
          return module;
        },
        global: global 
      });
      load(main);
    }
  };

})(typeof window != 'undefined' ? window : global)
/* ('mainModule', function(System) {
  System.register(...);
}); */

('main', function(System) {




System.register("api", [], function(_export) {
  var baseDomain,
      http,
      sendRequest;
  _export("getTasks", getTasks);
  _export("getTaskById", getTaskById);
  _export("addTask", addTask);
  _export("editTask", editTask);
  _export("deleteTask", deleteTask);
  function getTasks(callback) {
    var url = baseDomain + "api/tasks";
    sendRequest("GET", url).then(function(data) {
      callback(data);
    });
  }
  function getTaskById(taskId, callback) {
    var url = baseDomain + "api/tasks/" + taskId;
    sendRequest("GET", url).then(function(data) {
      callback(data);
    });
  }
  function addTask(task, callback) {
    var url = baseDomain + "api/tasks";
    sendRequest("POST", url, task).then(function(data) {
      callback(data);
    });
  }
  function editTask(taskId, task, options, callback) {
    var url = baseDomain + "api/tasks/" + taskId;
    sendRequest("PUT", url, task).then(function(data) {
      callback(data);
    });
  }
  function deleteTask(taskId, callback) {
    var url = baseDomain + "api/tasks/" + taskId;
    sendRequest("DELETE", url).then(function(data) {
      callback(data);
    });
  }
  return {
    setters: [],
    execute: function() {
      "use strict";
      baseDomain = "http://localhost:3000/";
      http = new XMLHttpRequest();
      sendRequest = function(req, url, params) {
        var promise = new Promise(function(resolve, reject) {
          if (params) {
            params = JSON.stringify(params);
          }
          http.onreadystatechange = function() {
            if (http.readyState === 4 && http.status === 200) {
              resolve(http.responseText);
            }
          };
          http.open(req, url, true);
          http.setRequestHeader("Content-type", "application/json");
          http.send(params);
        });
        return promise;
      };
      ;
      ;
      ;
      ;
      ;
    }
  };
});

System.register("main", ["api"], function(_export) {
  var Api,
      tasks,
      taskTpl,
      isEditing,
      taskId;
  function getTasks() {
    var promise = new Promise(function(resolve, reject) {
      Api.getTasks(function(tasks) {
        resolve(JSON.parse(tasks));
      });
    });
    return promise;
  }
  function getTemplate() {
    var promise = new Promise(function(resolve, reject) {
      var http = new XMLHttpRequest();
      http.open("GET", "../handlebars/taskTpl.hbs", true);
      http.send(null);
      http.onreadystatechange = function() {
        if (http.readyState === 4 && http.status === 200) {
          resolve(http.responseText);
        }
      };
      http.onerror = function(e) {
        reject(e);
      };
    });
    return promise;
  }
  function fetchTask(task) {
    var typeSection = document.getElementsByClassName(task.type)[0],
        errMsg = "Required fields are missing.",
        okMsg = "Everything went fine!";
    if (!task.name || !task.author || !task.type) {
      return errMsg;
    } else {
      if (!typeSection) {
        return;
      }
      var taskHtml = taskTpl(task),
          currentTask = document.createElement("div");
      currentTask.setAttribute("data-taskid", task._id);
      currentTask.classList.add("task");
      currentTask.innerHTML = taskHtml;
      typeSection.appendChild(currentTask);
      return okMsg;
    }
  }
  function addTask(options) {
    var promise = new Promise(function(resolve, reject) {
      Api.addTask(options, function(task) {
        fetchTask(JSON.parse(task));
        return "Task succesfully added.";
      });
    });
    toggleDialog();
  }
  function editTask(taskId, taskObj) {
    var promise = new Promise(function(resolve, reject) {
      Api.editTask(taskId, taskObj, {}, function(task) {
        updateTask(JSON.parse(task));
        isEditing = false;
      });
    });
    toggleDialog();
  }
  function updateTask(task) {
    var taskEl = document.querySelectorAll("[data-taskid=\"" + task._id + "\"]")[0],
        formerType = taskEl.closest(".board").classList[1];
    if (formerType !== task.type) {
      taskEl.parentElement.removeChild(taskEl);
      fetchTask(task);
    } else {
      taskEl.getElementsByClassName("task-name")[0].textContent = task.name;
      taskEl.getElementsByClassName("task-author")[0].textContent = task.author;
      taskEl.getElementsByClassName("task-desc")[0].textContent = task.description;
    }
  }
  return {
    setters: [function(_api) {
      Api = _api;
    }],
    execute: function() {
      "use strict";
      tasks = undefined;
      taskTpl = undefined;
      isEditing = false;
      taskId = undefined;
      getTemplate().then(function(data) {
        taskTpl = Handlebars.compile(data);
        getTasks().then(function(tasks) {
          for (var i = 0; i < tasks.length; i++) {
            fetchTask(tasks[i]);
          }
        });
      });
      window.toggleDialog = function(taskObj) {
        var dialog = document.getElementsByClassName("add-task-dialog")[0],
            inputs = document.getElementsByClassName("properties")[0].getElementsByTagName("input"),
            editTitle = "Edit Task",
            addTaskTitle = "Add New Task";
        if (dialog.classList.contains("hidden")) {
          dialog.classList.remove("hidden");
        } else {
          dialog.classList.add("hidden");
          for (var i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
          }
        }
        var titleEl = document.getElementsByClassName("add-task-dialog")[0].getElementsByTagName("h2")[0];
        if (taskObj) {
          var taskName = taskObj.taskName;
          var taskAuthor = taskObj.taskAuthor;
          var taskDesc = taskObj.taskDesc;
          var taskType = taskObj.taskType;
          document.getElementsByClassName("name-input")[0].getElementsByTagName("input")[0].value = taskName;
          document.getElementsByClassName("author-input")[0].getElementsByTagName("input")[0].value = taskAuthor;
          document.getElementsByClassName("description-input")[0].getElementsByTagName("input")[0].value = taskDesc;
          document.getElementById(taskType).checked = true;
          titleEl.innerHTML = editTitle;
        } else {
          titleEl.innerHTML = addTaskTitle;
        }
      };
      window.getNewTaskOptions = function() {
        var taskName = document.getElementsByClassName("name-input")[0].getElementsByTagName("input")[0].value,
            taskAuthor = document.getElementsByClassName("author-input")[0].getElementsByTagName("input")[0].value,
            taskDesc = document.getElementsByClassName("description-input")[0].getElementsByTagName("input")[0].value,
            typeCheckbox = document.getElementsByClassName("task-type-form")[0].getElementsByTagName("input"),
            taskType = undefined;
        for (var i = 0; i < typeCheckbox.length; i++) {
          if (typeCheckbox[i].checked) {
            taskType = typeCheckbox[i].value;
          }
        }
        if (!taskName || !taskAuthor || !taskDesc)
          return;
        var taskObject = {
          name: taskName,
          author: taskAuthor,
          type: taskType,
          description: taskDesc
        };
        if (isEditing) {
          editTask(taskId, taskObject);
        } else {
          addTask(taskObject);
        }
      };
      window.deleteTask = function(obj) {
        var taskEl = obj.parentElement,
            taskId = taskEl.getAttribute("data-taskid");
        var promise = new Promise(function(resolve, reject) {
          Api.deleteTask(taskId, function(task) {
            taskEl.parentElement.removeChild(taskEl);
            return "Task succesfully deleted.";
          });
        });
      };
      window.showEditDialog = function(obj) {
        var taskEl = obj.parentElement,
            taskObj = {
              taskName: taskEl.getElementsByClassName("task-name")[0].textContent,
              taskAuthor: taskEl.getElementsByClassName("task-author")[0].textContent,
              taskDesc: taskEl.getElementsByClassName("task-desc")[0].textContent,
              taskType: taskEl.closest(".board").classList[1]
            };
        taskId = taskEl.getAttribute("data-taskid");
        isEditing = true;
        toggleDialog(taskObj);
      };
      _export("Api", Api);
      _export("fetchTask", fetchTask);
      _export("addTask", addTask);
      _export("toggleDialog", toggleDialog);
      _export("editTask", editTask);
    }
  };
});


});