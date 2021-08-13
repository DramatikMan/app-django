import { FC } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import HomePage from './HomePage';
import About from './About';
import RoomSettingsPage from './RoomSettingsPage';


const App: FC = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/about' component={About} />
        <Route exact path='/create' component={RoomSettingsPage} />
      </Switch>
    </Router>
  );
};


export default App;