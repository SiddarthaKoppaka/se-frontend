import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserHome = () => {
  const [userName, setUserName] = useState('');
  const [isTwoFactorEnabled, setisTwoFactorEnabled] = useState('');
  const [caption, setCaption] = useState('');
  const [postText, setPostText] = useState('');
  const [createdAt, setcreatedAt] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();


  // PAGE INIT
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // navigate('/'); // Redirect to login if no token found
        handleLogout();
        return;
      }
  
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/userDetail`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          alert('Failed to fetch user data');
          // navigate('/login');
          handleLogout();
        }
        const data = await response.json();
        
        setPosts(data.posts);
        setUserName(data.username);
        setisTwoFactorEnabled(data.twoFactorEnabled);

        console.log('POSTS:', data.posts);
        
        // console.log(`2FA: ${data.twoFactorEnabled}`);

        if (isTwoFactorEnabled) {
          navigate('/verify2FA', { state: { username: userName } });
        }
      } catch (error) {
        alert('Failed to fetch user data');
          handleLogout();
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [navigate]);
  

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (name === 'image') {
      setImage(files[0]);
    } else if (name === 'video') {
      setVideo(files[0]);
    }
  };


  // UPLOAD POSTS
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('post', postText);
    if (image) formData.append('image', image);
    if (video) formData.append('video', video);
    setCaption(caption);
    setPostText(postText);

    console.log(`formData: ${formData}`);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user-posts/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Successfully Posted');
        window.location.reload();
      } else {throw new Error('File upload failed');}

      const result = await response.json();
    } catch (error) {
      console.error('Error uploading:', error);
    }
  };
  
  

  // DELETE POSTS
  const handleDeletePost = async (postId) => {
    // Confirm before deleting
    const isConfirmed = window.confirm('Are you sure you want to delete this post?');
    if (!isConfirmed) {
      return; // Stop if not confirmed
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user-posts/delete/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete the post');
      }
  
      // Remove the post from the local state to update UI
      setPosts(posts.filter(post => post.postId !== postId));
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting the post:', error);
      alert('Error deleting the post');
    }
  };
  

  // SEARCH
  const handleSearch = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleLogout();
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/search?query=${searchQuery}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Search failed');
      }
  
      const data = await response.json();
      setSearchResults(data);
      // console.log("##user.requestStatus##:", user.requestStatus);
      console.log("data:", data);
      // const updatedData = data.map(user => ({ ...user, requestSent: false }));
      // setSearchResults(updatedData);
    } catch (error) {
      console.error('Error during search:', error);
    }
  };


  // Add Friends
  const handleAddFriend = async (friendUsername) => {
    const token = localStorage.getItem('token');
    
    console.log("userName: ", userName);
    console.log("friendUsername: ", friendUsername);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/friends/request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
        body: friendUsername, 
        // JSON.stringify({recipientUsername: friendUsername }),
      });
  
      if (response.ok) {
        alert('Friend request sent!');
        const updatedResults = searchResults.map(user => {
          if (user.username === friendUsername) {
            return { ...user, requestSent: true };
          }
          return user;
        });
        setSearchResults(updatedResults);
      } else {
        alert('Failed to send friend request.');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };  
  

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome to Your Dashboard, {userName || 'User'}!</h2>
      <p>This is your personalized user home page. From here, you can:</p>
      <ul>
        <li>View your profile</li>
        <li>Access your settings</li>
        <li>Explore available features</li>
      </ul>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>
      <button onClick={() => navigate('/settings')}>Settings</button>
      <button onClick={() => navigate('/2FA', { state: { username: userName , 
                                                isTwoFactorEnabled: isTwoFactorEnabled} })}>2 Factor Authentication</button> 
      <div>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div style={{ padding: '20px' }}>
      {/* Existing UI elements */}
      <div>
        <label>
          Caption:
          <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
        </label>
        <label>
          Post Text:
          <textarea value={postText} onChange={(e) => setPostText(e.target.value)} />
        </label>
        <label>
          Image:
          <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
        </label>
        <label>
          Video:
          <input type="file" name="video" accept="video/*" onChange={handleFileChange} />
        </label>
        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
    <div>
    <div style={{ maxWidth: '500px', margin: 'auto' }}>

    <div>
      {searchResults.map((user, index) => (
        <div key={index} style={{ padding: '10px', margin: '5px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <p>{user.firstname} {user.lastname} (@{user.username})</p>
        <button onClick={() => navigate(`/user/${user.username}`)}>View Profile</button>
        {user.requestSent === "NONE" && <button onClick={() => handleAddFriend(user.username)}>Add Friend</button>}
        {user.requestSent === "PENDING" && <button disabled>Pending</button>}
        {user.requestSent === "ACCEPTED" && <button disabled>Friends</button>}
        {user.requestSent === "REJECTED" && <button onClick={() => handleAddFriend(user.username)}>Retry Add Friend</button>}
      </div>
      ))}
  </div>


  {posts.map((post, index) => (
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
      <button onClick={() => handleDeletePost(post.postId)}>Delete</button>

    </div>
  ))}
</div>
</div>
</div>
);
};

export default UserHome;

