import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Signup.css';


const Signup = () => {
  const navigate = useNavigate();
  const [disableButton, setDisableButton] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({headerError: '', emailError: '', usernameError: '', passwordError: ''});

  //TODO - add a useEffect hook to fetch the usernames to ensure uniqueness.
  //TODO - change the headerError to use the errorBar object.

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


  const handleSubmit = (e) => {
    setDisableButton(true);
    e.preventDefault();
    navigate('/postpage', {state: {origin: 'signup', postBody: {username, email, password}}})
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