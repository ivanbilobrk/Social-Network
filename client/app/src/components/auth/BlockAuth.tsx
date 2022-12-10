import { useLocation, Navigate, Outlet } from "react-router-dom";
import getUser from "../../util/getUser";

const BlockAuth = ()=>{
    const location = useLocation();
    try{
        const user = getUser();
        if(user!== null){
            return(
                <Navigate to="/home" state={{from: location}} replace/>
            )
        } else {
            return(
                <Outlet/>
            )
        }

    } catch(error){
        localStorage.removeItem("accessToken");
        return(
            <Outlet/>
        )
    }
}

export default BlockAuth;