import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import SessionContext from "../SessionContext";


//Blank page used to send POST requests.
//Since POST isn't idempotent, this page exists to prevent a user from
// creating multiple requests by spamming a login or signup button.
//After all requests are made, this page should transparently route the user
// to their final destination.

const PostPage = () => {

  const {state} = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useContext(SessionContext)


  useEffect(() => {
    console.log(state);
    if (state?.origin === 'login' || state?.origin === 'initial-login') {
      let init = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(state.postBody)
      }
      const nextState = {};
      fetch('http://localhost:8080/users/login', init)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            if (res.status === 404) {
              throw new Error(`No such user ${state.postBody.username}`);
            } else if (res.status === 401) {
              throw new Error(`Incorrect password for user ${state.postBody.username}`);
            } else if (res.status === 500) {
              throw new Error('500 Internal Server Error');
            }
          }
        })
        .then(data => {
          setSession({token: data.token, user_id: data.user_id, expire_timestamp: data.expire_timestamp})
        })
        .catch(err =>  {
          console.log(err);
          if (state.origin === 'login') {
            nextState.error = err; 
          } else {
            nextState.error = `User created, but unable to log in.\n${err}`;
          }
        })
        .finally(() => {
          navigate('/login', {state: nextState, replace: true})
        });
    } else if (state?.origin === 'signup') {
      let init = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(state.postBody)
      }
      fetch('http://localhost:8080/users', init)
    .then(res => {
      if (res.ok) {
        return res.json();
      } else if (res.status === 400) {
        throw new Error("400: Bad Request, cannot create user");
      } else if  (res.status === 409) {
        throw new Error(`409: User ${state.postBody.username} already exists`);
      } else if (res.status === 500) {
        throw new Error("500: Internal Server Error, cannot create user");
      }
    }).then((userData) => {
      //Fetch to log in
      navigate('/postpage', {replace: true, state: {origin: 'initial-login', postBody: state.postBody}})

    })
    .catch(err => {
      let nextState = {error: err}
      if (err.message.includes('409')) {
        navigate('/signup', {replace: true, state: nextState})
      } else {
        navigate('/', {replace: true, state: nextState});
      }
    })
    } else {
      //Default: no post request, in case the user goes directly to this page.
      navigate('/', {replace: true})
    }
  }, [state])
  

  return ( <div className="post-page">Redirecting...</div> );
}
 
export default PostPage;