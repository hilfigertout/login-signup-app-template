import { useLocation } from "react-router-dom";
import './ErrorBar.css';

const ErrorBar = () => {
  const {state} = useLocation();
  return ( state?.error ? <div className="error-bar">{`${state?.error}`}</div> : <></>  );
}
 
export default ErrorBar;