import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    shippingAddress: '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Control if the user is editing the profile

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Ensure you are passing the token in the request header
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set the data to the state
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        '/api/users/profile', 
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile data:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 p-6">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-md p-6 rounded-lg">
        {/* Sidebar content */}
      </div>

      {/* Profile Content */}
      <div className="w-3/4 p-8 bg-white shadow-md rounded-lg ml-6">
        <h1 className="text-xl text-red-500 font-bold mb-6">Edit Your Profile</h1>

        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">First Name</label>
              <input
                className="w-full border border-gray-300 h-10 rounded-lg px-4 bg-gray-100 focus:ring-2 focus:ring-red-300 outline-none"
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                disabled={!isEditing} // Disable field if not editing
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                className="w-full border border-gray-300 h-10 rounded-lg px-4 bg-gray-100 focus:ring-2 focus:ring-red-300 outline-none"
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                disabled={!isEditing} // Disable field if not editing
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Address</label>
              <input
                className="w-full border border-gray-300 h-10 rounded-lg px-4 bg-gray-100 focus:ring-2 focus:ring-red-300 outline-none"
                type="text"
                name="shippingAddress"
                value={userData.shippingAddress}
                onChange={handleChange}
                disabled={!isEditing} // Disable field if not editing
              />
            </div>
          </div>
        </form>

        <div className="mt-6 flex justify-between items-center">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-600 hover:text-red-500 transition duration-300"
            >
              Edit Profile
            </button>
          ) : (
            <div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-600 hover:text-red-500 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300 shadow-md ml-4"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
