import { FC } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import HomePage from './HomePage';
import About from './About';


const App: FC = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/about' component={About} />
      </Switch>
    </Router>
  );
}


export default App;