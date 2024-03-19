import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserActions } from '../context/UserActionsContext';
import { likePost, unlikePost } from '../actions/postActions';

import Share from './share/Share';
import Posts from './posts/Posts';

const UserHome = () => {
  const [userName, setUserName] = useState('');
  const [isTwoFactorEnabled, setisTwoFactorEnabled] = useState('');
  const [posts, setPosts] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, logout, fetchUserDetails } = useAuth();

  // PAGE INIT
  useEffect(() => {
    const fetchDetailsAndSetState = async () => {
      const token = localStorage.getItem('token');
      if (!user && token) {
        await fetchUserDetails(token); 
      } else if (!token) {
        handleLogout();
        return; 
      }
  
      if (user) {
        setPosts(user.posts || []);
        setUserName(user.username || '');
        setisTwoFactorEnabled(user.twoFactorEnabled || false);
        setFriendRequests(user.friendRequestsPending || []);
        setFriends(user.friends || []);
      }
    };
  
    fetchDetailsAndSetState();
  }, [user, navigate, fetchUserDetails]);
  

// LOGOUT
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  console.log("USER: ", user);

  return (
      <div style={{ padding: '20px' }}>
        <h2>Welcome to Your Dashboard, {userName || 'User'}!</h2>
        <p>This is your personalized user home page. From here, you can:</p>
        <ul>
          <li>View your profile</li>
          <li>Access your settings</li>
          <li>Explore available features</li>
        </ul>

        <Share />
        <div style={{ padding: '20px' }}>

      </div>
      <div>
      <div style={{ maxWidth: '500px', margin: 'auto' }}>
    <Posts />
  </div>
  </div>
  </div>
);
};

export default UserHome;
