import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import React from 'react';
import UserContext from './UserContext';
import SessionContext from './SessionContext';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import useLocalStorageState from './useLocalStorageState';


function App() {

  const [user, setUser] = React.useState({});
  const [session, setSession] = useLocalStorageState({token: '', user_id: -1, expire_timestamp: undefined}, 'session_token');

  React.useEffect(() => {
    if (session.token) {
     if (session.expire_timestamp <= Date.now()) {
        setSession({token: '', expire_timestamp: undefined});
      } else {
        fetch(`http://localhost:8080/users/login/${session.token}`)
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            setUser(data);
          } else {
            throw new Error(data.message)
          }
        })
        .catch(err => console.log(err));
      }
    }
  }, [])



  return (
    <div className="App">
      <SessionContext.Provider value={[session, setSession]}>
        <UserContext.Provider value={[user, setUser]}>
          <Router>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
            </Routes>
          </Router>
        </UserContext.Provider>
      </SessionContext.Provider>
    </div>
  );
}

export default App;
