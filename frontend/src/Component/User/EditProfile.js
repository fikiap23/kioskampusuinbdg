import React, { useState } from 'react'
import { useUser } from '../../UserContext'
import { useNavigate } from 'react-router-dom'
import { PiCheckCircle } from 'react-icons/pi' // Untuk ikon ceklis
import Navbar from '../Navbar';

const EditProfile = () => {
  const { user, setUser } = useUser();
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleEdit = async () => {
    if (!user || !user.user_id) {
      console.error('User data or user_id is missing.');
      return;
    }

    let isModified = false;
    const userData = {};

    // Track modified fields
    for (const key in user) {
      if (user[key] !== user.currentUser?.[key]) {
        userData[key] = user[key];
        isModified = true;
      }
    }

    // Only include password if it's not empty
    if (password) {
      userData['password'] = password;
      isModified = true;
    } else {
      delete userData.password; // Ensure password is not included if empty
    }

    if (!isModified) {
      alert('No changes made to the profile.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/user/${user.user_id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData), // Send only the modified fields
        }
      );

      if (!response.ok) throw new Error('Failed to edit user data');

      const updatedUser = await response.json();
      setUser(updatedUser);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate('/profile');
      }, 1500); 
    } catch (error) {
      console.error('Error in handleEdit:', error);
    }
  };

  return (
    <div className="h-screen">
      <Navbar />
      <div className="flex flex-col h-full w-full justify-center items-center">
        <div className='border border-gray-300 p-8 rounded-xl shadow-sm mb-4 text-sm'>
          <div className="flex mb-4">
            <div className='w-72 font-medium'>Full Name</div>
            <input
              className="flex pl-4 w-full bg-gray-100 rounded-xl p-1 mb-5"
              name="name"
              value={user?.name || ''}
              onChange={handleChange}
            />
          </div>

          <div className="flex mb-4">
            <div className='w-72 font-medium'>Email</div>
            <input
              className="flex pl-4 w-full bg-gray-100 rounded-xl p-1 mb-5"
              name="email"
              value={user?.email || ''}
              onChange={handleChange}
            />
          </div>

          <div className="flex mb-4">
            <div className='w-72 font-medium'>WhatsApp Number</div>
            <input
              className="flex pl-4 w-full bg-gray-100 rounded-xl p-1 mb-5"
              name="no_wa"
              value={user?.no_wa || ''}
              onChange={handleChange}
            />
          </div>

          <div className="flex mb-4">
            <div className='w-72 font-medium'>Password</div>
            <input
              className="flex pl-4 w-full bg-gray-100 rounded-xl p-1 mb-5"
              name="password"
              type="password"
              placeholder="Enter new Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleEdit}
          className="bg-green-600 hover:bg-green-800 px-8 py-1 rounded-lg text-white"
        >
          Update
        </button>
      </div>
      {showAlert && (
        <div className="z-20 fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg">
          Profile updated successfully!
        </div>
      )}
    </div>
  );
};

export default EditProfile
