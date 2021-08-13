import * as ReactDOM from 'react-dom';
import { CssBaseline } from '@material-ui/core';
import { createTheme, ThemeProvider, Theme } from '@material-ui/core/styles';
import { createStore, Store } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import App from './components/App';
import reducer from './reducers';


const darkTheme: Theme = createTheme({ palette: { type: 'dark' } });
const store: Store = createStore(reducer, composeWithDevTools());


ReactDOM.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
  document.getElementById('app')
);