import styled from 'styled-components';

import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { BiExit } from 'react-icons/bi';

import api from '../services/api';
import formatErrors from '../utils';

import Loading from '../components/Loading';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState();
  const [total, setTotal] = useState(0);
  const [formatedTotal, setFormatedTotal] = useState();

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  async function handleLoadTransactions() {
    setIsLoading(true);

    try {
      const { data } = await api.get('/transactions');

      const calcTotal = data.transactions.reduce((acc, obj) => {
        if (obj.type === 'entrada') {
          return acc + obj.value;
        }
        return acc - obj.value;
      }, 0);

      let formatedCalcTotal;

      if (calcTotal < 0) {
        formatedCalcTotal = calcTotal
          .toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
          .replace('-', '');
      } else {
        formatedCalcTotal = calcTotal.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }

      setUser(data.name);
      setTotal(calcTotal);
      setFormatedTotal(formatedCalcTotal);
      setTransactions(data.transactions);
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

  async function handleLogout() {
    setIsLoading(true);

    try {
      await api.delete('/session');

      localStorage.removeItem('token');

      enqueueSnackbar('Deslogado com sucesso!', {
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

  useEffect(() => {
    handleLoadTransactions();
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <HomeContainer>
        <Header>
          <h1>Olá, {user}</h1>
          <BiExit onClick={handleLogout} />
        </Header>

        <TransactionsContainer>
          <ul>
            {transactions?.map(transaction => {
              const formatedValue = transaction.value.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              });

              return (
                <ListItemContainer key={transaction._id}>
                  <div>
                    <span>{transaction.date}</span>
                    <strong>{transaction.description}</strong>
                  </div>
                  <Value
                    color={
                      transaction.type === 'entrada' ? 'positivo' : 'negativo'
                    }
                  >
                    {formatedValue}
                  </Value>
                </ListItemContainer>
              );
            })}
          </ul>

          <article>
            <strong>Saldo</strong>
            <Value color={total >= 0 ? 'positivo' : 'negativo'}>
              {formatedTotal}
            </Value>
          </article>
        </TransactionsContainer>

        <ButtonsContainer>
          <button onClick={() => navigate('/nova-transacao/entrada')}>
            <AiOutlinePlusCircle />
            <p>
              Nova <br /> entrada
            </p>
          </button>

          <button onClick={() => navigate('/nova-transacao/saida')}>
            <AiOutlineMinusCircle />
            <p>
              Nova <br />
              saída
            </p>
          </button>
        </ButtonsContainer>
      </HomeContainer>
    </>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`;

const TransactionsContainer = styled.article`
  flex-grow: 1;
  max-height: calc(100vh - 225px);
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ul {
    padding: 0 16px;
    height: 100%;
    overflow: auto;
  }

  article {
    padding: 10px 16px 0 16px;
    display: flex;
    justify-content: space-between;

    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`;

const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;

  button {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    p {
      font-size: 18px;
      font-weight: 700;
    }
  }
`;

const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${props => (props.color === 'positivo' ? 'green' : 'red')};
`;

const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;

  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
`;
