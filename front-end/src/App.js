import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import React from 'react';
import UserContext from './UserContext';
import TokenContext from './TokenContext';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import useLocalStorageState from './useLocalStorageState';


function App() {

  const [user, setUser] = React.useState({});
  const [token, setToken] = useLocalStorageState({}, 'token');

  React.useEffect(() => {
    if (token.tokenString) {
      if (token.expiration <= Date.now()) {
        setToken('');
      } else {
        //TODO - fetch user information;
      }
    }
  }, [])
  

  //TODO - add localstorage to store the token from the database.


  return (
    <div className="App">
      <TokenContext.Provider value={[token, setToken]}>
        <UserContext.Provider value={[user, setUser]}>
          <Router>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
            </Routes>
          </Router>
        </UserContext.Provider>
      </TokenContext.Provider>
    </div>
  );
}

export default App;
