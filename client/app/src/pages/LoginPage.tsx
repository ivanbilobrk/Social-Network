import {Login} from '../components/auth/Login'
import NavBar from '../components/auth/NavBarLoginSignup' 

export default function LoginPage(){

    return(
        <>
            <NavBar/>
            <Login/>
        </>
    );

}

export { LoginPage };