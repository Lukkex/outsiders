import '../Stylesheets/App.css';
import '../Stylesheets/SignUp.css';
import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import SiteHeader from '../../utils/SiteHeader';

function SignUp() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState('');

    const handleInput = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    //When users submit their sign up info, redirects to Landing page without rereshing
    //*** No error checking atm: users can submit nothing, etc
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("button clicked");
        

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            setError("Please fill out all required fields before submitting.")
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        navigate('/');
    };
    
    return (
        <div>
            <SiteHeader></SiteHeader>
            <br></br>
            <br></br>
            <br></br>
            <div className="signup-container">
                <h1 class="font-semibold">Create Your Account</h1>
                <div className="form-container">
                    {error && <p style={{color: 'red' }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="firstName"placeholder="First Name" className="form-input" value={formData.firstName} onChange={handleInput}/>
                        <input type="text" name="lastName" placeholder="Last Name" className="form-input" value={formData.lastName} onChange={handleInput}/>
                        <input type="email" name="email" placeholder="Email" className="form-input" value={formData.email} onChange={handleInput}/>
                        <input type="password" name="password" placeholder="Password" className="form-input" value={formData.password} onChange={handleInput}/>
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" className="form-input" value={formData.confirmPassword} onChange={handleInput}/>
                        <br></br>
                        <button type="submit" className="rounded-button">Sign Up</button>
                    </form>
                    <br></br>
                    <p class="font-semibold">Already have an account?</p>
                    <p><Link class="underline" to="/signin">Sign in here</Link>.</p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;