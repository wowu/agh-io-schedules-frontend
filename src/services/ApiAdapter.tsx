import { AuthService, RefreshResponse } from "./AuthService";

export enum ApiError {
  NotAuthenticated = 0,
  Unknown = 1,
}

export class ApiAdapter {
  static async call(request: Request): Promise<Response | ApiError> {

    const response = await this.authAndFetch(request);
    if (!(response instanceof Response)) {
      return response;
    }

    if (response.status === 401) {
      const refreshResponse = await AuthService.refreshToken()
      switch (refreshResponse) {
        case RefreshResponse.Success:
          return this.authAndFetch(request);
        case RefreshResponse.Expired:
        case RefreshResponse.NotLoggedIn:
          return ApiError.NotAuthenticated;
        case RefreshResponse.UnknownError:
          return ApiError.Unknown;
      }
    }

    return response;
  }

  static async authAndFetch(request: Request): Promise<Response | ApiError> {
    const user = AuthService.getCurrentUser()
    if (user === null) {
      return ApiError.NotAuthenticated;
    }
    request.headers.set('Authorization', `Bearer ${user.accessToken}`)
    return fetch(request);
  }
}