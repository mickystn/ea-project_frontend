
import "../css/home.css";
import "../css/dashbord.css";
import { Button } from "antd";
import { useState,useEffect } from "react";
import Navbar from "../component/navbar";
import Axios from "axios";
import { Link,useNavigate,createSearchParams } from "react-router-dom";

import { message } from "antd";


function port(){
    const [userid,setUserid]=useState(34);

    const [allport,setAllport]=useState([]);

    const [addFrom,setAddfrom]=useState("");

    return (
        <div>
            <h>test</h>
        </div>
    )
}

export default port;