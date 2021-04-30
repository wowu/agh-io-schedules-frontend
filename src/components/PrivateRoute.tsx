import { Route, Redirect } from 'react-router-dom';

import { AuthService } from '../services/AuthService';

export default function PrivateRoute(props: any) {
  if (AuthService.getToken()) {
    return <Route {...props} />;
  } else {
    return <Redirect to="/login" />;
  }
}
