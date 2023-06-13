import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import React from 'react';
import UserContext from './UserContext';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';


function App() {

  const [user, setUser] = React.useState({});

  return (
    <div className="App">
      <UserContext.Provider value={[user, setUser]}>
        <Router>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </Router>
        
      </UserContext.Provider>
    </div>
  );
}

export default App;
