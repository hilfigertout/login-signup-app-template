import './App.css';
import Login from './pages/Login';
import React from 'react';
import UserContext from './UserContext';


function App() {

  const [user, setUser] = React.useState({});

  return (
    <div className="App">
      <UserContext.Provider value={[user, setUser]}>
        <Login />
      </UserContext.Provider>
    </div>
  );
}

export default App;
