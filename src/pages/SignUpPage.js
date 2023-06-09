import styled from 'styled-components';

import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import api from '../services/api';
import formatErrors from '../utils';

import MyWalletLogo from '../components/MyWalletLogo';
import Loading from '../components/Loading';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  async function handleSignUp(e) {
    e.preventDefault();

    setIsLoading(true);

    if (password !== repeatedPassword) {
      return enqueueSnackbar('Passwords must match!', {
        variant: 'error'
      });
    }

    try {
      await api.post('/sign-up', { name, email, password });

      enqueueSnackbar('Success!', {
        variant: 'success'
      });

      navigate('/');
    } catch (error) {
      const errors = formatErrors(error);

      errors.map(item =>
        enqueueSnackbar(item, {
          variant: 'error'
        })
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && <Loading />}
      <SingUpContainer>
        <form onSubmit={handleSignUp}>
          <MyWalletLogo />
          <input
            placeholder="Nome"
            type="text"
            value={name}
            onChange={e => {
              setName(e.target.value);
            }}
          />
          <input
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
            }}
          />
          <input
            placeholder="Senha"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
            }}
          />
          <input
            placeholder="Confirme a senha"
            type="password"
            autoComplete="new-password"
            value={repeatedPassword}
            onChange={e => {
              setRepeatedPassword(e.target.value);
            }}
          />
          <button>Cadastrar</button>
        </form>

        <Link to="/">Já tem uma conta? Entre agora!</Link>
      </SingUpContainer>
    </>
  );
}

const SingUpContainer = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
