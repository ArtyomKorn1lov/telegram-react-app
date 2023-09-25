import './app-page.scss';
import React from 'react';
import TelegramPage from '../telegram-page/telegram-page';
import { ThemeProvider, createTheme } from '@mui/material';
import { UserContextProvider } from '../../contexts/user-context';

const theme = createTheme({
  multilineColor: {
    color: 'white'
  }
});

const AppPage = () => {
  return (
    <ThemeProvider theme={theme} >
      <UserContextProvider>
        <div className="app">
          <header className="app__header">
            <TelegramPage />
          </header>
        </div>
      </UserContextProvider>
    </ThemeProvider>
  );
}

export default AppPage;
