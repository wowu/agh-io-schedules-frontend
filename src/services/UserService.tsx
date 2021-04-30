import { objectToFormData } from '../helpers/form';
import { ApiAdapter } from './ApiAdapter';

export type User = {
  id: number;
  email: string;
  activeSubscription: boolean;
};

type Response<T> = {
  response: any;
  data: T;
};

export class UserService {
  static async getUsers(): Promise<Response<{ users: User[] }>> {
    try {
      const response = await ApiAdapter.get('/api/users/');
      let data = await response.json();
      return Promise.resolve({ response, data });
    } catch (error) {
      console.error('getUsers: ', error);
      return Promise.reject(error);
    }
  }

  static async getUser(id: number): Promise<Response<User>> {
    try {
      const response = await ApiAdapter.get(`/api/users/${id}`);
      let data = await response.json();
      return Promise.resolve({ response, data });
    } catch (error) {
      console.error('getUser: ', error);
      return Promise.reject(error);
    }
  }

  static async createUser(email: string, activeSubscription: boolean): Promise<Response<User>> {
    try {
      const response = await ApiAdapter.post(
        '/api/users/',
        objectToFormData({
          email,
          activeSubscription,
        })
      );
      let data = await response.json();
      return Promise.resolve({ response, data });
    } catch (error) {
      console.error('createUser: ', error);
      return Promise.reject(error);
    }
  }

  static async updateUser(
    id: number,
    email: string,
    activeSubscription: boolean
  ): Promise<Response<User>> {
    try {
      const response = await ApiAdapter.put(
        `/api/users/${id}`,
        objectToFormData({
          email,
          activeSubscription,
        })
      );
      let data = await response.json();
      return Promise.resolve({ response, data });
    } catch (error) {
      console.error('createUser: ', error);
      return Promise.reject(error);
    }
  }

  static async changePassword(id: number, newPassword: string): Promise<Response<User>> {
    try {
      const response = await ApiAdapter.put(
        `/api/users/${id}`,
        objectToFormData({
          password: newPassword,
        })
      );
      let data = await response.json();
      return Promise.resolve({ response, data });
    } catch (error) {
      console.error('changePassword: ', error);
      return Promise.reject(error);
    }
  }

  static async removeUser(id: number): Promise<any> {
    try {
      const response = await ApiAdapter.delete(`/api/users/${id}`);
      return Promise.resolve(response);
    } catch (error) {
      console.error('removeUser: ', error);
      return Promise.reject(error);
    }
  }
}
