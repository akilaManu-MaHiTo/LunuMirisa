import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function imageUpload(){

    const[image,setImage] = useState("");
    const navigate = useNavigate();

    function covertTobase64(e){

        console.log(e)
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {

            console.log(reader.result);
            setImage(reader.result);

        };
        reader.onerror = error => {
            console.log("Error",error);
        };
    }

    const Submit = (e) => {

        e.preventDefault();
        axios.post("http://localhost:3001/addImage",{image})
        .then(result => {

            console.log(result)
            navigate('/') 

        })            
        .catch(err => console.log(err))

    }

    return (

        <div>
                <form onSubmit={Submit}>
                <div>
                    <label htmlFor="">Upload a Image</label>
                    <input type="file" accept="image/" onChange={covertTobase64} />

                </div>

                {image ? (
                    <img width={100} height={100} src={image} alt="Uploaded preview" />
                ) : null}

                <button type="submit">Submit</button>

            </form>
        </div>
        
    )
}

export default imageUpload;