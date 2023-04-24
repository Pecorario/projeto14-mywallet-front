import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import styled from 'styled-components';

import api from '../services/api';
import formatErrors from '../utils';

import MyWalletLogo from '../components/MyWalletLogo';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  async function handleSignIn(e) {
    e.preventDefault();

    try {
      const { data } = await api.post('/sign-in', { email, password });

      localStorage.setItem('token', data.token);

      enqueueSnackbar('Login efetuado com sucesso!', {
        variant: 'success'
      });

      navigate('/home');
    } catch (error) {
      const errors = formatErrors(error);

      errors.map(item =>
        enqueueSnackbar(item, {
          variant: 'error'
        })
      );
    }
  }

  return (
    <SingInContainer>
      <form onSubmit={handleSignIn}>
        <MyWalletLogo />
        <input
          placeholder="E-mail"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          placeholder="Senha"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button>Entrar</button>
      </form>

      <Link to="/cadastro">Primeira vez? Cadastre-se!</Link>
    </SingInContainer>
  );
}

const SingInContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
