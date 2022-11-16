import axios from '../api/axios';

const useLogout = ()=>{

    const logout = async ()=>{
      localStorage.removeItem("accessToken");

        try{
            const repsonse = await axios('/logout',);
        } catch(error){
            console.log(error);
        }
    }
    return logout;
}

export default useLogout;