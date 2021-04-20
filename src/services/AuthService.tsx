
export const API_URL = process.env.REACT_APP_API_URL

export enum AuthResponse {
  Success = 0,
  WrongPassword = 1,
  UnknownError = 2,
}

export enum RefreshResponse {
  Success = 0,
  Expired = 1,
  NotLoggedIn = 2,
  UnknownError = 3,
}

export class AuthService {
  static async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/token/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const text = await response.text();
    const data = JSON.parse(text);

    if (!response.ok) {
      if (data.ERROR === 'Wrong username or password.') {
        return AuthResponse.WrongPassword;
      } else {
        return AuthResponse.UnknownError;
      }
    }

    localStorage.setItem('user', JSON.stringify(data));

    return AuthResponse.Success;
  }

  static async refreshToken(): Promise<RefreshResponse> {
    const user = this.getCurrentUser()
    if (!user) {
      return RefreshResponse.NotLoggedIn;
    }

    const response = await fetch(`${API_URL}/api/token/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.refreshToken}` },
    });

    const text = await response.text();
    const data = JSON.parse(text);

    if (!response.ok) {
      if (response.status === 401) {
        this.logout()
        return RefreshResponse.Expired;
      }
      return RefreshResponse.UnknownError;
    }

    localStorage.setItem('user', JSON.stringify(data));
    return RefreshResponse.Success;
  }

  static logout() {
    localStorage.removeItem('user');
  }

  static getCurrentUser(): null | any {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      return JSON.parse(storedUser);
    } else {
      return null;
    }
  }
}
