
let url = new URL(window.location.origin);
url.port = 3001;
const socketBase = url.origin;

async function get(path) {
  let url = new URL(path, window.location.origin);
  url.port = 3001;
  return await fetch(url.href)
  .then(res => res.json())
  .catch(err => console.log(err)||[])
};

async function post(path = '', data = {}) {
  let url = new URL(path, window.location.origin);
  url.port = 3001;
  // Default options are marked with *
  return await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    mode: 'cors', // no-cors, *cors, same-origin
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  .then(res => res.json())
  .catch(err => console.log(err)||[])
}

export {
  socketBase,
  get,
  post,
}
