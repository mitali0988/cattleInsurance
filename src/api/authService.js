import api from '@/utils/api';
import { API_ROUTES } from '@/utils/apiConstants';
import TokenService from '@/utils/tokenService';

class AuthService {
  async login(credentials) {
    try {
      const response = await api.post(API_ROUTES.LOGIN_USER, JSON.stringify(credentials));
      if (response.data.token) {
        TokenService.setToken(response.data.token);
        TokenService.setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw new Error('Login failed. Please try again.');
    }
  }
  async forgotPassword(email) {
    try {
      const response = await api.post(API_ROUTES.FORGOT_PASSWORD, { email });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send password reset email. Please try again.');
    }
  }
  async resetPassword( token, password) {
    try {
      const response = await api.post(API_ROUTES.CHANGE_PASSWORD, {
        token,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error('Error resetting password');
    }
  }
  async changePassword( password) {
    try {
      const response = await api.post(API_ROUTES.CHANGE_PASSWORD, {
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error('Error resetting password');
    }
  }
  logout() {
    TokenService.removeToken();
    TokenService.removeUser();
  }
}

export default new AuthService();
