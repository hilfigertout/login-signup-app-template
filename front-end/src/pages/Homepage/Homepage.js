import {useNavigate, useLocation} from 'react-router-dom';
import { useEffect } from 'react';

// For your own custom homepage, replace this component
const Homepage = () => {

  const {state} = useLocation();

  const navigate = useNavigate();
  useEffect(() => {
    navigate('/login', {state: state, replace: true});
  }, [])
  
  return ( <div className="Homepage"></div> );
}
 
export default Homepage;