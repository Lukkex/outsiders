import { deleteUser } from 'aws-amplify/auth';
import React, { useState } from 'react';
import '../../Stylesheets/App.css';
import '../../Stylesheets/Settings.css'; // Create this new file for Settings-specific styles
import SiteContainer from '../../../utils/SiteContainer';
import FadeInSection from '../../../utils/FadeInSection.js';
import { useNavigate, Link } from "react-router-dom";
import { list, remove } from 'aws-amplify/storage';
import { getCurrentUserInfo } from '../../../services/authConfig';

function UserAccountDeletion() {

  const [confirmationText, setConfirmationText] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setConfirmationText(e.target.value);
  };

  const handleDeleteUser = async () => {
    if (confirmationText === "I am sure") {
      try {
        await deleteUserUploads();
        await deleteUser(); 
        await signOut();
        clearUserData();
      } 
      catch (error) {
        console.log(error);
      }
      navigate('/login'); // Redirect to login page after sign out
    }
    else {
      alert('Please type exactly "I am sure" to confirm.');
    }
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
                    <div class="max-w-[80vw] gray-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-gray-900 bg-gray-600">
                        <p>Are you sure you want to delete your account?</p>
                        <p>All information associated with your account (including forms) will be removed.</p>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <input
                      className="border-[2px] max-w-[80vw] rounded-md border-gray-500 p-6 text-black"
                      type="text"
                      id="confirmationInput"
                      data-testid="confirmationInput"
                      value={confirmationText}
                      onChange={handleInputChange}
                      placeholder='Type "I am sure" here'
                    />
                    <br/>
                    <br/>
                    <div class="flex space-x-20 max-w-[80vw]">
                      <FadeInSection duration={7500}>
                        <div class="gray-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-red-900 bg-red-600">
                          <Link onClick={handleDeleteUser}>Confirm</Link>
                        </div>
                      </FadeInSection>
                      <br/>
                      <div class="gray-gradient border border-gray-200 p-8 rounded-3xl shadow-lg shadow-gray-900 bg-cyan-600">
                          <Link to="/settings"><u>Cancel</u></Link>
                      </div>
                    </div>
                </div>
            </div>
        }/>
    );
}

export default UserAccountDeletion