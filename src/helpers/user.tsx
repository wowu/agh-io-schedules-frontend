import { useContext } from 'react';
import { decodeToken } from 'react-jwt';
import { TokenContext } from '../contexts/token';

type TokenUser = {
  exp: number;
  userId: number;
  scope: 'ADMIN' | 'LECTURER';
  sub: string;
};

class User {
  email: string;
  scope: 'ADMIN' | 'LECTURER';

  constructor(decodedToken: TokenUser) {
    this.email = decodedToken.sub;
    this.scope = decodedToken.scope;
  }

  get isAdmin(): boolean {
    return this.scope === 'ADMIN';
  }
}

export function useUser(): User | null {
  const { token } = useContext(TokenContext);
  if (!token) return null;

  const userFromToken = decodeToken(token.token);
  return new User(userFromToken);
}
