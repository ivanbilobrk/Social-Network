import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <BrowserRouter>
    <Routes>  
      <Route path="/edit" element={<EditProfile/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
