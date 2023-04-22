
import "../css/home.css";
import "../css/dashbord.css";
import { Button } from "antd";
import { useState,useEffect } from "react";
import Navbar from "../component/navbar";
import Axios from "axios";
import { Link,useNavigate,createSearchParams } from "react-router-dom";

import { useLocation } from "react-router-dom";
import { message } from "antd";


function Port(){
    const location = useLocation();
    const [userid,setUserid]=useState(location.state.id);

    const [allport,setAllport]=useState([]);

    const [addFrom,setAddfrom]=useState("");

    useEffect(()=>{
        Axios.get(`https://api-ea.vercel.app/allport`).then((res)=>{
            setAllport(res.data);
        })
    },[])

    const u_port = allport.filter((obj)=>{
        return obj.user_id==userid;
    }) 
    //delete method
    async function deletePort(port){
        await Axios.delete(`https://api-ea.vercel.app/deletetran/${port}`).then((res) => {
            console.log(res);
        });
        await Axios.delete(`https://api-ea.vercel.app/deleteOneport/${port}`).then((res) => {
            console.log(res);
        });
        window.location.reload();
    }

    async function addPort(){
        await Axios.post("https://api-ea.vercel.app/addport", {
            Userid: userid,
            portnumber: addFrom
        }).then((response) => {
            if (response.data.msg === "add port number success") {
                message.success("Add port number success");
            } else {
                message.error("This port number already exists.");
            }
        });
        window.location.reload();
    }
    function onChangePort(evt){
        setAddfrom(evt.target.value);
    }
    return (
        <div>
            <Navbar></Navbar>
            <div className="landingpage_dashbord"> 
            <div className="container"> 
                <main>
                <div className="recent-orders"> 
                <Button className ="btn" type="primary" size={"small"} onClick={addPort} >add port</Button>
                <input onChange={onChangePort} placeholder="input port number"></input>          
                <table className="tables">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th className="mail-hidden">EMAIL</th>
                        <th className="mail-hidden">PORT NUMBER</th>

                    </tr>
                    </thead>

                    <tbody>
                    {
                        u_port.map((val)=>{
                            return (
                                <tr>
                                <td>{val.user_id}</td>
                                <td>{val.user_name}</td>
                                <td>{val.email}</td>
                                <td>{val.port_number}</td>
                                <td> <Link className="warning" to="/Dashbord/port/transaction" state={{id:val.port_number}}>Show port</Link></td>
                                <td> <Button className ="btn" type="text" danger size={"small"} onClick={()=>{deletePort(val.port_number)}}>delete</Button></td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                    </table>
                </div>
                </main>

            </div>
            </div>
        </div>
    )
}

export default Port;