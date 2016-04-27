let baseDomain = 'http://localhost:3000/';

export function getTasks() {
  let http = new XMLHttpRequest();
  http.onreadystatechange = () => {
    if (http.readyState === 4 && http.status === 200) {
      return http.responseText;
    }
  }
  http.open("GET", baseDomain + 'api/tasks', true);
  http.send(null);
};