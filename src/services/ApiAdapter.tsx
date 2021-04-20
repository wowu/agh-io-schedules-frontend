import { API_URL, AuthService, RefreshResponse } from "./AuthService";
import history from "../history"

export enum ApiError {
  NotAuthenticated = 0,
  Unknown = 1,
}

export class ApiAdapter {

  static async get(resource: string): Promise<Response>{
    const request = new Request(`${API_URL}${resource}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    return this.call(request);
  }

  private static async call(request: Request): Promise<Response> {
    let response;

    try{
      response = await this.authAndFetch(request);
    } catch (error) {
      console.log('call: ', error);
      return Promise.reject(error)
    }
    
    if (response && response.status === 401) {
      const refreshResponse = await AuthService.refreshToken()
      switch (refreshResponse) {
        case RefreshResponse.Success:
          return this.authAndFetch(request);
        case RefreshResponse.Expired:
        case RefreshResponse.NotLoggedIn: {
          history.push('/login');
          return Promise.reject('Not logged in');
        }
        case RefreshResponse.UnknownError:
          return Promise.reject('Unknown');
      }
    }

    return response;
  }

  private static async authAndFetch(request: Request): Promise<Response> {
    const user = AuthService.getCurrentUser();
    if (user === null) {
      history.push('/login');
      return Promise.reject('Not logged in');
    }
    request.headers.set('Authorization', `Bearer ${user.token}`);
    return fetch(request);
  }
}