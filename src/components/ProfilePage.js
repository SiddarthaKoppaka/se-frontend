import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../actions/userProfileActions';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { profile, isLoading, error } = useSelector((state) => state.userProfile);
  const { token } = useAuth();

  useEffect(() => {
    if (username) {
      dispatch(fetchUserProfile(username, token));
    }
  }, [dispatch, username]);

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log("PROFILE: ", profile);

  return (
    <div>
      <h1>{profile?.firstname} {profile?.lastname}</h1>
      
      {profile?.posts.map((post, index) => (
      <div key={index} style={{
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '10px',
        marginBottom: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>{post.caption}</h3>
        <p style={{ margin: '0 0 10px 0' }}>{post.post}</p>
        {post.imageUrl && (
          <img src={post.imageUrl} alt="Post" style={{ maxWidth: '100%', height: 'auto', display: 'block', marginBottom: '10px' }} />
        )}
        {post.videoUrl && (
          <video controls style={{ maxWidth: '100%', height: 'auto', display: 'block', marginBottom: '10px' }}>
            <source src={post.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {post.createdAt && (
          <div style={{ color: '#777', fontSize: '0.8rem', marginTop: '10px' }}>
            Posted on: {new Date(post.createdAt).toLocaleString()}
          </div>
        )}

    </div>
  ))}
  
    </div>
    
  );
};

export default ProfilePage;
