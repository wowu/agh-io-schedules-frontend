const API_URL = 'https://agh-schedules-backend.herokuapp.com';

export enum AuthResponse {
  Success = 0,
  WrongPassword = 1,
  UnknownError = 2,
}

export class AuthService {
  static async login(
    username: string,
    password: string
  ): Promise<AuthResponse> {
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
