/**
 * Colectivo API client.
 * Handles authenticated requests to the backend.
 */

const API = (() => {
  let baseUrl = '';

  function init(url) {
    baseUrl = url.replace(/\/$/, '');
  }

  async function request(path, options = {}) {
    const token = await Auth.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Request failed (${res.status})`);
    }

    return data;
  }

  function get(path) {
    return request(path);
  }

  function post(path, body) {
    return request(path, { method: 'POST', body: JSON.stringify(body) });
  }

  function put(path, body) {
    return request(path, { method: 'PUT', body: JSON.stringify(body) });
  }

  function patch(path, body) {
    return request(path, { method: 'PATCH', body: JSON.stringify(body) });
  }

  function del(path) {
    return request(path, { method: 'DELETE' });
  }

  return { init, get, post, put, patch, del };
})();
