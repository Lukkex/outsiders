import '../App.css';
import { useNavigate } from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();

    //When users submit their sign up info, redirects to Landing page without rereshing
    //*** No error checking atm: users can submit nothing, etc
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/');
    };
    
    //Page content
    return (
      <div>
        <h1>Create an Account</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    );
  }
  
  export default SignUp;