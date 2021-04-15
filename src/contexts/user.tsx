import React from 'react';

export type ContextProps = {
  user: any | null;
  setUser: (user: any) => void;
};

export const UserContext = React.createContext<ContextProps>({
  user: null,
  setUser: () => {},
});
