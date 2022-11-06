import { useNavigate } from "react-router-dom";


const Unauthorized = () => {
    const navigate = useNavigate();
    const goBack = () =>{
        navigate(-1);
    }
    return(
        <>
        <div>Nemate dozvolu za ovu stranicu</div>
        <button onClick = {goBack}>Idi nazad</button>
        </>
    )
}

export default Unauthorized;