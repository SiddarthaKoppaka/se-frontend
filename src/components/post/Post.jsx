import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import './post.scss'

const Post = ({ post, onLikePost, onUnlikePost, onDeletePost }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  
  const toggleLike = () => {
    setLiked(!liked);
    
    liked ? onUnlikePost(post.postId) : onLikePost(post.postId);
  };

  

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '10px',
      padding: '10px',
      marginBottom: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            {/* Assuming profilePic exists */}
            {post.profilePic && <img src={post.profilePic} alt="" />}
            <div className="details">
              <Link to={`/profile/${post.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
                <span className="name">{post.name}</span>
              </Link>
              {/* Simplifying to "1 min ago" for now. Use post.createdAt for actual data */}
            </div>
          </div>
          {/* <MoreHorizIcon /> */}
        </div>
        <div className="content">
          <p>{post.post}</p>
          {post.imageUrl && (
            <img src={post.imageUrl} alt="Post" style={{ maxWidth: '100%', height: 'auto', display: 'block', marginBottom: '10px' }} />
          )}
          {post.videoUrl && (
            <video controls style={{ maxWidth: '100%', height: 'auto', display: 'block', marginBottom: '10px' }}>
              <source src={post.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        
        <div className="info">
          <div className="item" onClick={toggleLike} >
            {liked ? <FavoriteOutlinedIcon className="custom-icon-size" /> : <FavoriteBorderOutlinedIcon className="custom-icon-size" />}
            12 Likes {/* Placeholder for like count */}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon className="custom-icon-size" />
            12 Comments {/* Placeholder for comment count */}
          </div>
          <div className="item">
            <ShareOutlinedIcon className="custom-icon-size" />
            Share
          </div>
          <div className="item" onClick={() => onDeletePost(post.postId)}>
            <DeleteOutlineIcon className="custom-icon-size"/>
            Delete
          </div>
        </div>
        {post.createdAt && (
          <div className="date" style={{ color: '#777', fontSize: '0.8rem', marginTop: '10px' }}>
            Posted on: {new Date(post.createdAt).toLocaleString()}
          </div>
        )}
        {/* {commentOpen && <Comments />} Assuming Comments component is defined */}
        {/* Adding action buttons */}
      </div>
    </div>
    </div>
  );
};

export default Post;
