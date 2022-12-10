import getUser from './getUser';

export default function handleLogout(){
    if(getUser() != null){
        localStorage.removeItem("accessToken");
    }
}

export{handleLogout};