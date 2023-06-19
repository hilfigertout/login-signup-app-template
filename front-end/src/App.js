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
  const [token, setToken] = useLocalStorageState({tokenString: '', expiration: undefined}, 'token');

  React.useEffect(() => {
    if (token.tokenString) {
     if (token.expiration <= Date.now()) {
        setToken({tokenString: '', expiration: undefined});
      } else {
        fetch(`http://localhost:8080/users/login/${token.tokenString}`)
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
