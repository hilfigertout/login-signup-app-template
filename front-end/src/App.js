import './App.css';
import {Login, Signup, Homepage, PostPage} from './pages';
import {useState, useEffect} from 'react';
import UserContext from './UserContext';
import SessionContext from './SessionContext';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import useLocalStorageState from './useLocalStorageState';



function App() {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [session, setSession] = useLocalStorageState({token: '', user_id: -1, expire_timestamp: undefined}, 'session_token');

  //TODO - add session storage hook and state to 

  useEffect(() => {
    setLoading(true);
    if (session.token) {
     if (session.expire_timestamp <= Date.now()) {
        setUser({});
        setSession({token: '', expire_timestamp: undefined});
        setLoading(false);
      } else {
        fetch(`http://localhost:8080/users/login?token=${session.token}&user_id=${session.user_id}&expire_timestamp=${session.expire_timestamp}`)
        .then(res => {
          if (res.ok) {
            return res.json()
          } else if (res.status === 401) {
            return {};
          } else {
            throw JSON.stringify(res.json());
          }
        })
        .then(data => {
          setUser(data);
        })
        .catch(err => console.log(err))
        .finally(setLoading(false));
      }
    } else {
      setUser({});
      setLoading(false);
    }
    //Cannot add setSession as a dependency, since the useLocalStorageState hook modifies it on every re-render.
    //That causes an infinite loop.
  }, [session]) 



  return (
    <div className="App">
      <UserContext.Provider value={[user, setUser]}>
        <SessionContext.Provider value={[session, setSession]}>
          {!loading && 
          <Router>
            <Routes>
              <Route path='/' element={<Homepage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/postpage' element={<PostPage />} />
            </Routes>
          </Router>
          }
        </SessionContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
