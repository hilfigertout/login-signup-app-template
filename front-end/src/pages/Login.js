import {useState, useEffect, useContext} from 'react';
import UserContext from '../UserContext';
import TokenContext from '../TokenContext';

const Login = () => {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useContext(UserContext)
  const [username, setUsername] = useState('');
  const [token, setToken] = useContext(TokenContext);

  const handleLogin = (e) => {
    e.preventDefault()
    const loginUsername = username;
    setLoading(true);
    if (loginUsername) {
      fetch('http://localhost:8080/users/login', {method: "POST"})
        .then((res) => res.json())
        .then(data => {
          //TODO - if login successful, set token to response token and get user data.
        })

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
    }
    setLoading(false);
  }

  const handleLogout = (e) => {
    e.preventDefault()
    setLoading(true);
    setUser({});
    //TODO Add anything else that needs to happen once a user logs out here. (set token, etc.)
    setLoading(false);
  }

  return ( 
  <div className="login-page">
    {!(user.username) &&
    <form>
      <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
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