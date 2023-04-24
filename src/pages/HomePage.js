import styled from 'styled-components';
import { BiExit } from 'react-icons/bi';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import formatErrors from '../utils';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function HomePage() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState();
  const [total, setTotal] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  async function handleLoadTransactions() {
    try {
      const { data } = await api.get('/transactions');

      const calcTotal = data.transactions.reduce((acc, obj) => {
        return acc + obj.value;
      }, 0);

      setUser(data.name);
      setTotal(calcTotal);
      setTransactions(data.transactions);
    } catch (error) {
      const errors = formatErrors(error);

      errors.map(item =>
        enqueueSnackbar(item, {
          variant: 'error'
        })
      );
    }
  }

  useEffect(() => {
    handleLoadTransactions();
  }, []);

  return (
    <HomeContainer>
      <Header>
        <h1>Olá, {user}</h1>
        <BiExit />
      </Header>

      <TransactionsContainer>
        <ul>
          {transactions?.map(transaction => (
            <ListItemContainer key={transaction._id}>
              <div>
                <span>{transaction.date}</span>
                <strong>{transaction.description}</strong>
              </div>
              <Value
                color={transaction.type === 'entrada' ? 'positivo' : 'negativo'}
              >
                {transaction.value.toFixed(2).replace('.', ',')}
              </Value>
            </ListItemContainer>
          ))}
        </ul>

        <article>
          <strong>Saldo</strong>
          <Value color={'positivo'}>{total.toFixed(2).replace('.', ',')}</Value>
        </article>
      </TransactionsContainer>

      <ButtonsContainer>
        <button>
          <AiOutlinePlusCircle />
          <p>
            Nova <br /> entrada
          </p>
        </button>
        <button>
          <AiOutlineMinusCircle />
          <p>
            Nova <br />
            saída
          </p>
        </button>
      </ButtonsContainer>
    </HomeContainer>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
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
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  article {
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
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
`;
