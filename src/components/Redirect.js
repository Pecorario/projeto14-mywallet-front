import { Navigate } from 'react-router-dom';

export default function Redirect() {
  const token = localStorage.getItem('token');

  if (token !== null) {
    return <Navigate to="/home" />;
  }

  return <Navigate to="/" />;
}
