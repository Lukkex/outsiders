import { deleteUser } from 'aws-amplify/auth';
import '../../Stylesheets/App.css';
import '../../Stylesheets/Settings.css'; // Create this new file for Settings-specific styles
import SiteContainer from '../../../utils/SiteContainer';
import { useNavigate, Link } from "react-router-dom";

function UserAccountDeletion() {

  const navigate = useNavigate();

  const handleDeleteUser = async () => {
    try {
      await deleteUser();
      await signOut();
      clearUserData();
    } catch (error) {
      console.log(error);
    }
    navigate('/login'); // Redirect to login page after sign out
  };

    return (
        <SiteContainer content = {
            <div className="UserDeletion">
                <div class="main-container text-white text-center xl:text-4xl lg:text-3xl md:text-2xl sm:text-1xl xs:textl">
                    <div class="text-3xl gray-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-gray-900 bg-gray-600">
                        
                        <p>Are you sure you want to delete your account?</p>
                    </div>
                    <br/>
                    <div class="text-3xl gray-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-gray-900 bg-cyan-600">
                        <Link onClick={handleDeleteUser}>Confirm</Link>
                    </div>
                    <br/>
                    <div class="text-3xl gray-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-gray-900 bg-cyan-600">
                        <Link to="/settings"><u>Cancel</u></Link>
                    </div>
                </div>
            </div>
        }/>
    );
}

export default UserAccountDeletion