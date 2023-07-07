import {useState, useEffect, useContext} from 'react';
import UserContext from '../../UserContext';
import SessionContext from '../../SessionContext';
import './Login.css'
import { useNavigate } from 'react-router-dom';
import {ErrorBar} from '../../components';

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useContext(UserContext)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useContext(SessionContext);

  const handleLogin = (e) => {
    e.preventDefault()
    const loginUsername = username;
    setLoading(true);
    if (loginUsername) {
      navigate('/postpage', {state: {origin: 'login', postBody: {username: username, password: password}}})
    } else {
      setLoading(false);
    }
  }

  const handleLogout = (e) => {
    e.preventDefault()
    setLoading(true);
    let init = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(session)
    }
    fetch('http://localhost:8080/users/login', init)
    .then(res => res.json())
    .catch(err => console.log(err))
    .finally(() => {
      setUser({})
      setSession({token: '', expiration: undefined, expire_timestamp: 0});
      setLoading(false);
    })
  }

  return ( 
  <div className="login-page">
    <ErrorBar />
    {!(session.token) && 
    <>
      <h1>Login</h1>
      <form>
        <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="login-button" disabled={loading} onClick={handleLogin}>Login</button>
      </form>
    </>
    }
    
    {session.token && user.username &&
    <>
      <h1>You are logged in as {user.username}</h1>
      <button onClick={handleLogout}>Logout</button>
    </>}
  </div>  
  );
}
 
export default Login;