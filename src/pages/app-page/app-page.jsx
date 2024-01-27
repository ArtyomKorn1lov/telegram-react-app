import './app-page.scss';
import React from 'react';
import TelegramPage from '../telegram-page/telegram-page';
import { ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from '../../store/create-store';

const theme = createTheme({
  multilineColor: {
    color: 'white'
  }
});

const AppPage = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme} >
        <div className="app">
          <header className="app__header">
            <TelegramPage />
          </header>
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default AppPage;
