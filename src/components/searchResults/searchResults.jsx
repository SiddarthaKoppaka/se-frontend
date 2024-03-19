import "./searchResults.scss"
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserActions } from '../../context/UserActionsContext';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResultsPage = () => {
  const query = useQuery().get('query');
  const [searchResultsUser, setSearchResultsUser] = useState([]);
  const [searchResultsPost, setSearchResultsPost] = useState([]);
  const [friendRequestsPending, setFriendRequestsPending] = useState([]);
  const [friends, setFriends] = useState([]);
  
  const { handleSearch, handleAddFriend, handleRemoveFriend, 
    handleBlockUser, handleUnblockUser } = useUserActions();
  
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const results = await handleSearch(query);
        console.log("resuts: ", results);
        setSearchResultsUser(results.users);
        setSearchResultsPost(results.posts);
      } catch (error) {
        console.error('Failed to fetch search results:', error);
        setSearchResultsUser([]);
        setSearchResultsPost([]);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);


      // ADD FRIEND
      const onAddFriend = async (addFriendUsername) => {
        const success = await handleAddFriend(addFriendUsername);
    
        if (success) {
          alert('Friend request sent successfully!');
        } else {
          alert('Failed to send friend request.');
        }
      };

      // REMOVE FRIENDS
      const removeFriend = async (friendId) => {
        const success = await handleRemoveFriend(friendId);
        if (success) {
          alert('Friend removed successfully');
          setFriends(currentFriends => currentFriends.filter(friend => friend.id !== friendId));
        } else {
          alert('Failed to remove friend');
        }
      };
  
      // BLOCK USER
      const blockUser = async (userId) => {
        const success = await handleBlockUser(userId);
        if (success) {
          alert('User blocked successfully');
        } else {
          alert('Failed to block user');
        }
      };
  
  
      // UNBLOCK USER
      const unblockUser = async (userId) => {
        const success = await handleUnblockUser(userId);
        if (success) {
          alert('User unblocked successfully');
        } else {
          alert('Failed to unblock user');
        }
      };

      
      

  return (
    <div>
    <div className="user-list">
        <h1>Users</h1>
        {searchResultsUser.map((user, index) => (
            <div key={index}  className="user-item">
            <p>{user.firstname} {user.lastname} (@{user.username})</p>
            <button className="remove-friend" onClick={() => removeFriend(user.id)}>Remove Friend</button>
            <button className="block" onClick={() => blockUser(user.id)}>Block</button>
            <button className="view-profile" onClick={() => navigate(`/user/${user.username}`)}>View Profile</button>
              {user.requestSent === "NONE" && <button onClick={() => onAddFriend(user.username)}>Add Friend</button>}
              {user.requestSent === "PENDING" && <button disabled>Pending</button>}
              {user.requestSent === "ACCEPTED" && <button disabled>Friends</button>}
              {user.requestSent === "BLOCKED" && <button onClick={() => unblockUser(user.id)}>Unblock</button>}
            </div>
        ))}
     </div>

    <div>
    <h1>Posts</h1>

    {searchResultsPost.map((post, index) => (
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
    </div>


  );
};

export default SearchResultsPage;
