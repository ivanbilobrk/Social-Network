import { SignupPage } from './pages/SignupPage';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import HomePage from './pages/HomePage';
import EditProfile from './pages/EditProfile';
import MyProfile from './pages/MyProfile';
import Test from './pages/Test';
import RequireAuth from './components/auth/RequireAuth';
import Unauthorized from './pages/Unauthorized';
import BlockAuth from './components/auth/BlockAuth';
import { Grid } from '@mui/material';
import React from 'react';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<RequireAuth allowedRoles={['user']} />}>
            <Route path="/test" element={<Test />} />
            <Route path="/home" element={<HomePage />}></Route>
            <Route path="/edit" element={<EditProfile />}></Route>
          </Route>
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route element={<BlockAuth />}>
            <Route path="signup" element={<SignupPage />}></Route>
            <Route path="login" element={<LoginPage />}></Route>
            <Route path="/myprofile" element={<MyProfile />}></Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
