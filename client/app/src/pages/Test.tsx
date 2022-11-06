import getUser from '../util/getUser';


const Test = ()=>{
    const user = getUser();
   
        if(user !== null){
            return (<p>{user.id + " "+user.email+" "+user.type+" "+user.username}</p>)
        } else {
            return (<p>Nema</p>)
        }
     
    
}

export default Test;