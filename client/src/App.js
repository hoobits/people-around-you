import "./App.scss";
import * as React from 'react';
import { StyledEngineProvider } from '@mui/material/styles';
import { ResponsiveAppBar } from './components/header/ResponsiveAppBar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./routes/main";
import Expenses from "./routes/expenses";
import Invoices from "./routes/invoices";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dark from './theme/dark.theme';
import light from './theme/light.theme';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

const getDesignTokens = (mode) => ({
  ...(mode === 'light'
    ? {
        ...light
      }
    : {
        ...dark
      }),
  }
);


export default function ToggleColorMode() {
  const [mode, setMode] = React.useState(localStorage.getItem('theme') ?? 'light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: (text) => {
        setMode((prevMode) => {
          let mode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('theme', mode);
          return mode;
        });
      },
    }),
    [],
  );

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

function App() {
  const colorMode = React.useContext(ColorModeContext);

  return (
    <StyledEngineProvider injectFirst>
      <ResponsiveAppBar toggleColorMode={colorMode.toggleColorMode} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="invoices" element={<Invoices />} />
        </Routes>
      </BrowserRouter>
    </StyledEngineProvider>
  );
}