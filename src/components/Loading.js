import { SyncLoader } from 'react-spinners';

import styled from 'styled-components';

export default function Loading() {
  return (
    <Container>
      <SyncLoader color="#8c11be" />
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;

  z-index: 1000;
  opacity: 0.5;

  background: white;

  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`;
