class TokenService {
  setToken(token) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  setUser(user) {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('userData'));
  }

  removeUser() {
    localStorage.removeItem('userData');
  }
}

export default new TokenService();
