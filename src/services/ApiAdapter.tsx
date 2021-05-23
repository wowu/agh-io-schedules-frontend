import { API_URL, AuthService, RefreshResponse } from './AuthService';
import history from '../history';

export enum ApiError {
  NotAuthenticated = 0,
  Unknown = 1,
}

export interface ApiAdapterOptions {
  tryAuthorize?: boolean;
}

export class ApiAdapter {
  static async put(
    resource: string,
    body: FormData | string = new FormData(),
    options: ApiAdapterOptions = {}
  ): Promise<Response> {
    const request = new Request(`${API_URL}${resource}`, {
      method: 'PUT',
      body: body,
      redirect: 'follow',
    });
    return this.call(request, options);
  }

  static async postErrors(
    resource: string,
    formData: FormData = new FormData()
  ): Promise<Response> {
    const request = new Request(`${API_URL}${resource}`, {
      method: 'POST',
      headers: { invalid: 'true' },
      body: formData,
      redirect: 'follow',
    });
    return this.call(request);
  }

  static async post(
    resource: string,
    formData: FormData = new FormData(),
    options: ApiAdapterOptions = {}
  ): Promise<Response> {
    const request = new Request(`${API_URL}${resource}`, {
      method: 'POST',
      body: formData,
      redirect: 'follow',
    });
    return this.call(request, options);
  }

  static async get(resource: string, options: ApiAdapterOptions = {}): Promise<Response> {
    const request = new Request(`${API_URL}${resource}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return this.call(request, options);
  }

  static async delete(resource: string, formData: any = undefined): Promise<Response> {
    let options: any = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };
    if (formData instanceof FormData) {
      options = {
        method: 'DELETE',
        body: formData,
      };
    }
    const request = new Request(`${API_URL}${resource}`, options);
    return this.call(request);
  }

  private static async call(request: Request, options: ApiAdapterOptions = {}): Promise<Response> {
    let response;
    const { tryAuthorize } = options;
    try {
      if (tryAuthorize !== false) {
        request = this.auth(request);
      }
      response = await fetch(request);
    } catch (error) {
      console.log('call: ', error);
      return Promise.reject(error);
    }

    if (response && response.status === 401) {
      const refreshResponse = await AuthService.refreshToken();
      switch (refreshResponse) {
        case RefreshResponse.Success: {
          return fetch(this.auth(request));
        }
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

  private static auth(request: Request): Request {
    const token = AuthService.getToken();
    if (token === null) {
      history.push('/login');
      return request;
    }
    request.headers.set('Authorization', `Bearer ${token.token}`);
    return request;
  }
}
