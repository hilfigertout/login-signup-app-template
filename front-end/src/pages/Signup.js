import {useState} from 'react';

const Signup = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');



  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    //TODO - fetch request to server, post to create new user.
  }

  return (
    <div className="signup">
      <form onSubmit={handleSubmit}>
        <label htmlFor='email'>Email</label>
        <input type='email' name='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
        <label htmlFor='username'>Username</label>
        <input type='text' name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <label htmlFor='password'>Password</label>
        <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <label htmlFor='confirm-password'>Confirm Password</label>
        <input type='password' name='confirm-password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button type='submit'>Create User</button>
      </form>
    </div>
    );
}
 
export default Signup;