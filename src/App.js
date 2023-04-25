import styled from 'styled-components';

import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate
} from 'react-router-dom';
import { useEffect } from 'react';

import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import TransactionsPage from './pages/TransactionPage';

import Redirect from './components/Redirect';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      if (location.pathname === '/' || location.pathname === '/cadastro') {
        navigate('/home');
      }
    }
  }, []);

  if (
    !token &&
    location.pathname !== '/' &&
    location.pathname !== '/cadastro'
  ) {
    return <Navigate to="/" />;
  }

  return (
    <PagesContainer>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/cadastro" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/nova-transacao/:tipo" element={<TransactionsPage />} />

        <Route path="*" element={<Redirect />} />
      </Routes>
    </PagesContainer>
  );
}

const PagesContainer = styled.main`
  background-color: #8c11be;
  width: 100vw;
  height: 100vh;
  padding: 25px;

  box-sizing: border-box;
`;
