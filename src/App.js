import React from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import RegisterPage from './components/RegisterPage';
import AccountVerified from './components/AccountVerified';
import UserHome from './components/UserHome';
import VerificationFailure from './components/VerificationFailure';
import ResetPasswordPage from './components/ResetPasswordPage';
import ResetPasswordComponent from './components/ResetPasswordComponent';
import UsernameSubmissionComponent from './components/UsernameSubmissionComponent';
import TwoFactorAuth from './components/TwoFactorAuth';
import VerifyTwoFactorAuth from './components/VerifyTwoFactorAuth';
import EditProfile from './components/EditProfile';
import FriendsList from './components/FriendsList';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './components/ProfilePage';
import SearchResultsPage from './components/searchResults/searchResults';
import { useDarkMode } from './context/DarkModeContext';

import "./style.scss";
import Navbar from './components/navBar/NavigationBar.jsx';
import LeftBar from './components/leftBar/LeftBar';
import RightBar from './components/rightBar/RightBar';


function App() {

  const themes = {
    light: {
      textColor: "#000",
      bg: "white",
      logo: "darkblue",
      bgSoft: "#f6f3f3",
      textColorSoft: "#555",
      border: "ightgray",
    },
    dark: {
      textColor: "whitesmoke",
      bg: "#22303C",
      logo: "white",
      bgSoft: "#333",
      textColorSoft: "lightgray",
      border: "#444",
    }
  };
  
  const { toggle, darkMode } = useDarkMode();
  const theme = darkMode ? themes.dark : themes.light;

  const Layout = () => {
    console.log("LAYOUT: ", darkMode);
    return (
    
    <div style={{ color: theme.textColor, backgroundColor: theme.bg }}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
          <RightBar />
        </div>
      </div>
    );
  };


  return (
    <BrowserRouter>
      <div>
        <Routes>

          <Route path="/" element={<LandingPage />} />
          
          <Route path="/register" element={<RegisterPage />} />
 
          <Route path="/account_verified" element={
            <ProtectedRoute sequentialAccessRequired={true} redirectTo="/">
              <AccountVerified />
            </ProtectedRoute>
          } />
          <Route path="/verification-failure" element={
            // <ProtectedRoute sequentialAccessRequired={true} redirectTo="/">
            <VerificationFailure />
            // </ProtectedRoute>
          } />
          
          
        {/* LAYOUT ROUTE START */}
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<UserHome />} />

          
          <Route path="/edit-profile" element={
              // <ProtectedRoute requireAuth={true}>
                <EditProfile />
              // </ProtectedRoute>
            } />
          
          <Route path="/friends" element={<FriendsList />} />

          
          <Route path="/search-results" element={<SearchResultsPage />} />

          <Route path="/2FA" element={
              // <ProtectedRoute requireAuth={true}>
                <TwoFactorAuth />
              // </ProtectedRoute>
            } />

          </Route>
          {/* ----- LAYOUT ROUTE END ----- */}


          
          <Route path="/user/:username" element={
            // <ProtectedRoute sequentialAccessRequired={true} redirectTo="/">
              <ProfilePage />
            // </ProtectedRoute>
          } />

          <Route path="/UsernameSubmissionComponent" element={
              // <ProtectedRoute requireAuth={true}>
                <UsernameSubmissionComponent />
              // </ProtectedRoute>
            } />

          <Route path="/ResetPasswordComponent" element={
              // <ProtectedRoute requireAuth={true}>
               <ResetPasswordComponent />
              // </ProtectedRoute>
            } />

          <Route path="/ResetPasswordPage" element={
              // <ProtectedRoute requireAuth={true}>
                <ResetPasswordPage />
              // </ProtectedRoute>
            } />
          
          {/* <Route path="/2FA" element={
              // <ProtectedRoute requireAuth={true}>
                <TwoFactorAuth />
              // </ProtectedRoute>
            } /> */}

          <Route path="/verify2FA" element={
              // <ProtectedRoute requireAuth={true}>
                <VerifyTwoFactorAuth />
              // </ProtectedRoute>
            } />
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
