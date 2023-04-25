import styled from 'styled-components';

import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

import api from '../services/api';
import formatErrors from '../utils';

import Loading from '../components/Loading';

export default function TransactionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('0,00');
  const [description, setDescription] = useState('');

  const { tipo: transactionType } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  async function handleSaveTransaction(e) {
    e.preventDefault();
    setIsLoading(true);

    const formatedValue = Number(value.replace(',', '.'));

    try {
      await api.post(`/new-transaction/${transactionType}`, {
        value: formatedValue,
        description
      });

      enqueueSnackbar('Success!', {
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
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(content) {
    const formattedValue = content
      .replace(/\D/g, '')
      .padStart(3, '0')
      .replace(/(\d{2})$/, ',$1');

    const intValue = parseInt(formattedValue.replace(/\D/g, ''), 10);
    const valueWithZeros = intValue.toString().padStart(3, '0');
    const finalValue = valueWithZeros.replace(/(\d{2})$/, ',$1');

    setValue(finalValue);
  }

  return (
    <>
      {isLoading && <Loading />}
      <TransactionsContainer>
        <h1>Nova {transactionType}</h1>
        <form onSubmit={handleSaveTransaction}>
          <input
            placeholder="Valor"
            type="text"
            value={`R$ ${value}`}
            onChange={e => handleChange(e.target.value)}
          />
          <input
            placeholder="Descrição"
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button>Salvar {transactionType}</button>
        </form>
      </TransactionsContainer>
    </>
  );
}

const TransactionsContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }
`;
