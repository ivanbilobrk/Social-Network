import logo from "./logo.svg";
import "./App.css";
import { SignupPage } from "./pages/SignupPage";
import { Route, Routes } from "react-router-dom";
import Layout from './components/Layout';
import { LoginPage } from "./pages/LoginPage";
import Test from "./pages/Test";
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./pages/Unauthorized";
import BlockAuth from "./components/BlockAuth";

function App() {
  return (
   
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
  );
}

export default App;