import { deleteUser } from 'aws-amplify/auth';
import '../../Stylesheets/App.css';
import '../../Stylesheets/Settings.css'; // Create this new file for Settings-specific styles
import SiteContainer from '../../../utils/SiteContainer';
import { useNavigate, Link } from "react-router-dom";
import { list, remove } from 'aws-amplify/storage';
import { getCurrentUserInfo } from '../../../services/authConfig';

function UserAccountDeletion() {

  const navigate = useNavigate();

  const handleDeleteUser = async () => {
    try {
      await deleteUserUploads();
      await deleteUser();
    } catch (error) {
      console.log(error);
    }
    navigate('/login'); // Redirect to login page after sign out
  };

  const deleteUserUploads = async () => {
    try {
      const user = await getCurrentUserInfo();
      const files = await list({
        path: `uploads/${user.email}/`
        // Alternatively, path: ({identityId}) => `album/${identityId}/photos/`
      });
      console.log(files);
      if (files.items.length == 0) {
        console.log('No associated files found. Proceeding with account deletion');
        return;
      }
      for (let i = 0; i < files.items.length; i++) {
        const result = await remove({ 
          path: files.items[i].path
          // Alternatively, path: ({identityId}) => `album/${identityId}/1.jpg`
        });
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  }

    return (
        <SiteContainer content = {
            <div className="UserDeletion">
                <div class="main-container text-white text-center xl:text-4xl lg:text-3xl md:text-2xl sm:text-1xl xs:textl">
                    <div class="text-3xl gray-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-gray-900 bg-gray-600">
                        
                        <p>Are you sure you want to delete your account?</p>
                        <p>All information associated with your account (including forms) will be removed.</p>
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