import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#22252B",
    },
    secondary: {
      main: "#2d3139",
      dark: "#008ae6",
      light: "#7e879a",
    },
    success: {
      main: "#00C49F",
    },
    error: {
      main: "#ff4200",
    },
    warning: {
      main: "#FFBB28",
    },
    info: {
      main: "#ff1493",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  shape: {
      borderRadius: 16,
  },
  typography: {
    fontFamily: '"Barlow", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
});

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
