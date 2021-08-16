import { FC } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import HomePage from './HomePage';
import About from './About';
import RoomSettingsPage from './RoomSettingsPage';
import RoomPage from './RoomPage';


const App: FC = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/about' component={About} />
        <Route exact path='/create' component={RoomSettingsPage} />
        <Route exact path='/room/:roomCode' component={RoomPage} />
      </Switch>
    </Router>
  );
};


export default App;