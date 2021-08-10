import * as ReactDOM from 'react-dom';
import { CssBaseline } from '@material-ui/core';
import { createTheme, ThemeProvider, Theme } from '@material-ui/core/styles';

import App from './components/App';


const darkTheme: Theme = createTheme({
  palette: {
    type: 'dark',
  },
});


ReactDOM.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.getElementById('app')
);