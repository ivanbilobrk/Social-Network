import getUser from '../util/getUser';
import NavBar from '../components/NavBar'


const Test = ()=>{
    const user = getUser();
   
        if(user !== null){
            return (
            <>
            <NavBar/>
            <p>{user.id + " "+user.email+" "+user.type+" "+user.username}</p>
            </>
            )
        } else {
            return (<p>Nema</p>)
        }
     
    
}

export default Test;