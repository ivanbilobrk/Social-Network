import logo from "./logo.svg";
import "./App.css";
import { SignupPage } from "./pages/SignupPage";
import { Route, Routes } from "react-router-dom";
import Layout from './components/Layout';
import { LoginPage } from "./pages/LoginPage";
import Test from "./pages/Test";
import RequireAuth from "./components/auth/RequireAuth";
import Unauthorized from "./pages/Unauthorized";
import BlockAuth from "./components/auth/BlockAuth";
import { Grid } from '@mui/material';
import React from 'react';
import Home from './pages/Home';

let posts = [
  {
    username: 'John Doe',
    date: '2021-10-10',
    description: 'I am having the time of my life rn',
    noOfLikes: 130,
  },
  {
    username: 'Ela Kumer',
    date: '2021-10-10',
    description: 'bla bla bla',
    noOfLikes: 140,
  },
  {
    username: 'Lovro Kovacic',
    date: '2021-10-10',
    description: 'bla bla bla',
    noOfLikes: 260,
  },
];



function App() {
  return (
        <>
        <Grid container direction="column" alignItems="center" justifyContent="center">
          <Grid item width="40%">
            <Home posts={posts} />
          </Grid>
        </Grid>
        
        <Routes>

          <Route path ="/" element={<Layout/>}>

            <Route element={<RequireAuth allowedRoles={["user"]}/>}>
                <Route path="/test" element={<Test/>}/>
            </Route>
            <Route path="unauthorized" element={<Unauthorized />} />
            
            <Route element={<BlockAuth/>}>
              <Route path="signup" element = {<SignupPage/>}></Route>
              <Route path="login" element = {<LoginPage/>}></Route>
            </Route>
            
          </Route>

        </Routes>
        </>
  )}

export default App;