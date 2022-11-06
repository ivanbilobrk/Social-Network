import { useState, useEffect } from 'react';
import{Link} from 'react-router-dom'
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useLogout from '../hooks/useLogout';
import jwt_decode from "jwt-decode";
import getUser from '../util/getUser'


export default function ProfilePage(){
    const [data, setData] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const logout = useLogout();
    const location = useLocation();         

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getData = async () => {
            try {
                const user = getUser();

                //samo primjer nekog requesta
                if(user !== null){
                    const response = await axiosPrivate.get(`/user/${user.id}`, {
                    });
                    console.log(response.data);
                    isMounted && setData(response.data);
                }
            } catch (err) {                                         
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getData();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    const signout = async() =>{
        await logout();
        navigate('/');
    }



    return(
        <>
        <div>Ovo je profile</div>
        </>
    );
};

export {ProfilePage}