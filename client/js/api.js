export default class Api {

  constructor() {
    this.baseDomain = 'http://localhost:3000/',
    this.http = new XMLHttpRequest();

    this.sendRequest = (req, url, params) => {
      let promise = new Promise( (resolve, reject) => {

        if (params) {
          params = JSON.stringify(params);
        }

        this.http.onreadystatechange = () => {
          if (this.http.readyState === 4 && this.http.status === 200) {
            resolve(this.http.responseText);
          }
        }

        this.http.onerror = e => {
          reject(e);
        };
        
        this.http.open(req, url, true);
        this.http.setRequestHeader('Content-type', 'application/json');
        this.http.send(params);
      });

      return promise;
    };
  }

  getTasks(callback) {
    let url = this.baseDomain + 'api/tasks';
    this.sendRequest('GET', url).then( data => {
      callback(data);
    });
  }

  getTaskById(taskId, callback) {
    let url = this.baseDomain + 'api/tasks/' + taskId;
    this.sendRequest('GET', url).then( data => {
      callback(data);
    });
  }

  addTask(task, callback) {
    let url = this.baseDomain + 'api/tasks';
    this.sendRequest('POST', url, task).then( data => {
      callback(data);
    });
  }

  editTask(taskId, task, options, callback) {
    let url = this.baseDomain + 'api/tasks/' + taskId;
    this.sendRequest('PUT', url, task).then( data => {
      callback(data);
    });
  }

  deleteTask(taskId, callback) {
    let url = this.baseDomain + 'api/tasks/' + taskId;
    this.sendRequest('DELETE', url).then( data => {
      callback(data);
    });
  }
}