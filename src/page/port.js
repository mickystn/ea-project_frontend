


import { useState,useEffect } from "react";
import Axios from "axios";


function port(){
    const [allport,setAllport]=useState([]);


    useEffect(()=>{
        Axios.get(`https://api-ea.vercel.app/allport`).then((res)=>{
            setAllport(res.data);
        })
    },[])

    return (
        <div>
            <h>test</h>
        </div>
    )
}

export default port;