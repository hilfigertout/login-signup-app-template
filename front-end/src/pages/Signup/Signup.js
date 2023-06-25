import {useState, useContext} from 'react';
import SessionContext from '../../SessionContext';
import {useNavigate} from 'react-router-dom';
import './Signup.css';


const Signup = () => {
  const navigate = useNavigate();
  const [session, setSession] = useContext(SessionContext);

  const [disableButton, setDisableButton] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({headerError: '', emailError: '', usernameError: '', passwordError: ''});

  //TODO - add a useEffect hook to fetch the usernames to ensure uniqueness.

  //TODO - refactor this error check to just use the error object, because why not?
  const dataValidationCheck = () => {
    return (!!(email && 
            email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) &&
            username &&
            password &&
            password === confirmPassword))
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if(e.target.value === '') {
      setError({...error, usernameError: 'Please enter a valid username'});
    } else {
      setError({...error, usernameError: ''});
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (e.target.value === '' || !(e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))) {
      setError({...error, emailError: 'Please enter a valid email'})
    } else {
      setError({...error, emailError: ''});
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value === '') {
      setError({...error, passwordError: 'Please enter a password'})
    } else if (e.target.value !== confirmPassword) {
      setError({...error, passwordError: 'Password fields must match.'})
    } else {
      setError({...error, passwordError: ''});
    }
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);

    if (e.target.value !== password) {
      setError({...error, passwordError: 'Password fields must match.'})
    } else if (password !== '') {
      setError({passwordError: ''});
    } else {
      setError({...error, passwordError: ''})
    }
  }


  //TODO - consider transparently routing the user to a third page to make the submission. This feels like best practice.
  const handleSubmit = (e) => {
    setDisableButton(true);
    e.preventDefault();
    
    let init = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: username, email: email, password: password})
    }
    //TODO - test this for inputting non-unique user, return an error message if so.
    fetch('http://localhost:8080/users', init)
    .then(res => {
      if (res.status === 201) {
        return res.json();
      } else if (res.status === 400) {
        setError({...error, headerError: "400 Bad Request Data, could not create user"});
        throw new Error("400: Bad Request");
      } else if (res.status === 500) {
        setError({...error, headerError: "500 Internal Server Error, could not create user"});
        throw new Error("500: Internal Server Error");
      }
    }).then((msg) => {
      console.log(msg.message);
      //Fetch to log in
      //TODO - handle this  failing to log us in initially, forcing us to refresh the page. Maybe implement the reroute tactic?
      fetch('http://localhost:8080/users/login', init)
      .then(res => res.json())
      .then((data) => {
          if (data.message?.match(/success/i)) {
            setSession({token: data.token, user_id: data.user_id, expire_timestamp: data.expire_timestamp})
          } else {
            throw new Error(data.message);
          }
      }).catch(err => console.log(err))
      .finally(() => {
        navigate('/login')
      })

    })
    .catch(err => console.log(err))
    .finally(() => {
      setDisableButton(false);
    })
  }

  return (
    <div className='signup-page'>
      <h1 className='header-error'>{error.headerError}</h1>
      <form>
        <label htmlFor='email'>Email <span className="label-error">{error.emailError}</span></label>
        <input type='email' name='email' placeholder='Email' value={email} onChange={handleEmailChange}/>
        <label htmlFor='username'>Username<span className="label-error">{error.usernameError}</span></label>
        <input type='text' name="username" placeholder="Username" value={username} onChange={handleUsernameChange} />
        <label htmlFor='password'>Password <span className="label-error">{error.passwordError}</span></label>
        <input type='password' name='password' value={password} onChange={handlePasswordChange} />
        <label htmlFor='confirm-password'>Confirm Password</label>
        <input type='password' name='confirm-password' value={confirmPassword} onChange={handleConfirmPasswordChange} />
        <button onClick={handleSubmit} disabled={disableButton && !dataValidationCheck()} type='submit'>Create User</button>
      </form>
    </div>
    );
}
 
export default Signup;