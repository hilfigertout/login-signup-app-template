import {useState, useEffect, useContext} from 'react';
import UserContext from '../UserContext';
import SessionContext from '../SessionContext';

const Login = () => {

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
      const init = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: username, password: password})
      }
      fetch('http://localhost:8080/users/login', init)
        .then((res) => res.json())
        .then(data => {
          if (data.message?.match(/success/i)) {
            setSession({token: data.token, user_id: data.user_id, expire_timestamp: data.expiration})
          } else {
            throw new Error(data.message);
          }
        })
        .catch(err => console.log(err))
        .finally(() => {
          setLoading(false);
          window.location.reload(false);
        });

      //Below code queried all users looking for one. We want to select one user. z
      // fetch('http://localhost:8080/users')
      // .then(res => res.json())
      // .then(data => {
      //   let foundUser = data.find(oneUser => oneUser.username = loginUsername)
      //   if (foundUser) {
      //     setUser(foundUser);
      //   } else {
      //     throw new Error(`No such user ${loginUsername}`)
      //   }
      // })
      // .catch(err => console.log(`Error: ${err}`))
      // .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }

  const handleLogout = (e) => {
    e.preventDefault()
    setLoading(true);
    const init = {
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
      setUser({});
      setSession({token: '', expiration: undefined, expire_timestamp: 0});
      setLoading(false);
    })
  }

  return ( 
  <div className="login-page">
    {!(user.username) &&
    <form>
      <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="login-button" disabled={loading} onClick={handleLogin}>Login</button>
    </form>
    }
    
    {user.username && 
    <div>
      <h1>You are logged in as {user.username}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>}
  </div>  
  );
}
 
export default Login;