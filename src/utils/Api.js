//API//

class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  //REQUEST//

  _request(endpoint, options = {}) {
    return fetch(`${this._baseUrl}${endpoint}`, {
      headers: this._headers,
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    }).then(this._handleResponse);
  }

  //RESPONSE//

  _handleResponse(res) {
    if (res.ok) return res.json();
    return Promise.reject(`Error: ${res.status}`);
  }

  //CARDS//

  getInitialCards() {
    return this._request("/cards");
  }

  addNewCard(data) {
    return this._request("/cards", {
      method: "POST",
      body: data,
    });
  }

  deleteCard(id) {
    return this._request(`/cards/${id}`, {
      method: "DELETE",
    });
  }

  //USER//

  getUserInfo() {
    return this._request("/users/me");
  }

  editUserInfo(data) {
    return this._request("/users/me", {
      method: "PATCH",
      body: data,
    });
  }

  editAvatar(data) {
    return this._request("/users/me/avatar", {
      method: "PATCH",
      body: data,
    });
  }

  //COMBINED//

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }
}

export default Api;
