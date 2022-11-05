import logo from "./logo.svg";
import "./App.css";
import { RegisterPage } from "./pages/SignupPage";
import { Route, Routes } from "react-router-dom";
import Layout from './components/Layout'

function App() {
  return (
   
        <Routes>

          <Route path ="/" element={<Layout/>}>
            <Route path="register" element = {<RegisterPage/>}></Route>

          </Route>

        </Routes>
  );
}

export default App;