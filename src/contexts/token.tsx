import React from 'react';
import { Token } from '../services/AuthService';

export type ContextProps = {
  token: Token | null;
  setToken: (user: any) => void;
};

export const TokenContext = React.createContext<ContextProps>({
  token: null,
  setToken: () => {},
});
