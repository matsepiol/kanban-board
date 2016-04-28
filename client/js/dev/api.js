let baseDomain = 'http://localhost:3000/';

function getTasks(callback) {
  let http = new XMLHttpRequest();
  http.onreadystatechange = () => {
    if (http.readyState === 4 && http.status === 200) {
      callback(http.responseText);
    }
  }
  http.open("GET", baseDomain + 'api/tasks', true);
  http.send(null);
};

export { getTasks };