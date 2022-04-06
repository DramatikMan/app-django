import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './HomePage';
import About from './About';
import RoomSettingsPage from './RoomSettingsPage';
import RoomPage from './RoomPage';
import RoomJoinPage from './RoomJoinPage';


const App: FC = (): JSX.Element => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/about' element={<About/>} />
                <Route
                    path='/create'
                    element={<RoomSettingsPage
                        isUpdate={false}
                        guestCanPause={false}
                        votesToSkip={2}
                        updateCallback={() => 0}
                    />}
                />
                <Route path='/room/:roomCode' element={<RoomPage/>} />
                <Route path='/join' element={<RoomJoinPage />} />
            </Routes>
        </Router>
    );
}


export default App;
