import { Style } from '@mui/icons-material';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'typeface-roboto';

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isQRCodeGenerated, setIsQRCodeGenerated] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  const userName = location.state?.username;
  const is2FAEnabled = location.state?.isTwoFactorEnabled;

  const handleEnable2FA = async () => {
    if (is2FAEnabled) {
      alert('Two-Factor Authentication is already enabled.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/setup2fa`, { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName }),
      });
      const qrCodeDataUrl = await response.text();
      setQrCodeUrl(qrCodeDataUrl);
      setIsQRCodeGenerated(true);
      console.log(`data: ${qrCodeDataUrl}`);
    } catch (error) {
      console.error('Error enabling 2FA:', error);
    }
  };

  const disable2FA = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/disable2fa`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName }),
      });

      if (response.ok) {
        alert('2FA disabled successfully.');
        navigate('/home'); // UserHome
      } else {
        alert('Failed to disable 2FA. Please try again.');
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      alert('An error occurred while disabling 2FA.');
    }
  };

  const proceedToVerifyOTP = () => {
    navigate('/verify2FA', { state: { username: userName } });
  };

  const styles = {
    title:{
      fontFamily:'"Roboto", sans-serif',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center', // This will center the container vertically
      alignItems: 'center',
      position: 'absolute', // Use absolute positioning
      top: '50%', // Position halfway down the parent
      left: '50%', // Position halfway across the parent
      transform: 'translate(-50%, -50%)', // This will center the container
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      width: '80%', // You can adjust this as necessary
      boxSizing: 'border-box',
      animation: 'fadeIn 1s ease-in-out',
      fontFamily:'"Roboto", sans-serif',
    },
    button: {
      marginTop: '10px',
      padding: '10px 20px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      backgroundColor: '#0056b3',
      color: '#fff',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      transition: 'background-color 0.3s ease-in-out',
      fontFamily:'"Roboto", sans-serif',
    },
    image: {
      marginTop: '20px',
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9',
      animation: 'fadeIn 1s ease-out',
      fontFamily:'"Roboto", sans-serif',
    },
    title: {
      color: '#333',
      textAlign: 'center',
      margin: '10px 0',
      fontWeight: 'bold',
      fontFamily:'"Roboto", sans-serif',
    }
  };


  return (
    <div style={styles.container}>
      <h2>Setup Two-Factor Authentication</h2>
      {!isQRCodeGenerated ? (
        <button
        onClick={handleEnable2FA}
        style={styles.button}
        className="buttonHoverEffect"
      >
        Generate QR Code
      </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <p style={{ margin: '10px 0' }}>Scan this QR code with your 2FA app:</p>
  <img src={qrCodeUrl} alt="QR Code" style={{ maxWidth: '100%', margin: '10px 0' }} />
  <button
  onClick={proceedToVerifyOTP}
  style={{ ...styles.button, margin: '10px 0' }}
  className="buttonHoverEffect"
>
  I've Scanned the QR Code
</button>
</div>

      )}
      {is2FAEnabled && (
        <button onClick={disable2FA} className="buttonHoverEffect">Disable 2FA</button>
      )}
    </div>
  );
};


export default TwoFactorAuth;
