import { SignupPage } from './pages/SignupPage';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import Test from './pages/Test';
import RequireAuth from './components/auth/RequireAuth';
import Unauthorized from './pages/Unauthorized';
import BlockAuth from './components/auth/BlockAuth';
import { Grid } from '@mui/material';
import React from 'react';
import Home from './pages/Home';
import HomePage from './pages/HomePage';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<RequireAuth allowedRoles={['user']} />}>
            <Route path="/test" element={<Test />} />
          </Route>
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route element={<BlockAuth />}>
            <Route path="signup" element={<SignupPage />}></Route>
            <Route path="login" element={<LoginPage />}></Route>
            <Route path="/home" element={<HomePage />}></Route>
            <Route path="/edit" element={<EditProfile />}></Route>
            {/* TODO ovo dvoje, home i edit, vrati u require authorized */}
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
