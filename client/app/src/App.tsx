import logo from "./logo.svg";
import "./App.css";
import { SignupPage } from "./pages/SignupPage";
import { Route, Routes } from "react-router-dom";
import Layout from './components/Layout'

function App() {
  return (
   
        <Routes>

          <Route path ="/" element={<Layout/>}>
            <Route path="register" element = {<SignupPage/>}></Route>

          </Route>

        </Routes>
  );
}

export default App;