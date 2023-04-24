import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyle from './style/GlobalStyle';
import ResetStyle from './style/ResetStyle';

import { SnackbarProvider } from 'notistack';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ResetStyle />
    <GlobalStyle />
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </React.StrictMode>
);
