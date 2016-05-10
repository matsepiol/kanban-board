let baseDomain = 'http://localhost:3000/',
    http = new XMLHttpRequest();

let sendRequest = (req, url, params) => {
  let promise = new Promise( (resolve, reject) => {

    if (params) {
      params = JSON.stringify(params);
    }

    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {
        resolve(http.responseText);
      }
    }

    http.onerror = (e) => {
      reject(e);
    };
    
    http.open(req, url, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.send(params);
  });

  return promise;
};

export function getTasks(callback) {
  let url = baseDomain + 'api/tasks';
  sendRequest('GET', url).then( (data) => {
    callback(data);
  });
};

export function getTaskById(taskId, callback) {
  let url = baseDomain + 'api/tasks/' + taskId;
  sendRequest('GET', url).then( (data) => {
    callback(data);
  });
};

export function addTask(task, callback) {
  let url = baseDomain + 'api/tasks';
  sendRequest('POST', url, task).then( (data) => {
    callback(data);
  });
};

export function editTask(taskId, task, options, callback) {
  let url = baseDomain + 'api/tasks/' + taskId;
  sendRequest('PUT', url, task).then( (data) => {
    callback(data);
  });
};

export function deleteTask(taskId, callback) {
  let url = baseDomain + 'api/tasks/' + taskId;
  sendRequest('DELETE', url).then( (data) => {
    callback(data);
  });
};