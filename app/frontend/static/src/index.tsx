import { FC } from 'react';
import * as ReactDOM from 'react-dom';
import { createTheme, ThemeProvider, Theme } from '@material-ui/core/styles';


const App: FC = (): JSX.Element => {
  return (
    <span>
      Hello from React.
    </span>
  );
}


const darkTheme: Theme = createTheme({
  palette: {
    type: 'dark',
  },
});


ReactDOM.render(
  <ThemeProvider theme={darkTheme}>
    <App />
  </ThemeProvider>,
  document.getElementById('app')
);