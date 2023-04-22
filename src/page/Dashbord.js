
import "../css/home.css";
import "../css/dashbord.css";
import { Button } from "antd";
import { useState,useEffect } from "react";
import Navbar from "../component/navbar";
import Axios from "axios";
import { Link,useNavigate,createSearchParams } from "react-router-dom";

import { useLocation } from "react-router-dom";
import { message } from "antd";


function Dashbord() {
  const [user,setUser]=useState([]);
  const [addFrom,setAddfrom]=useState("");
  const navigate=useNavigate();

  useEffect(()=>{
    Axios.get("https://api-ea.vercel.app/user").then((res)=>{
        setUser(res.data);
      }
    )
  },[])

  function addUser(){

  }

  function onChangeadd(evt){
    setAddfrom(evt.target.value);
  }
  return (
    <div>
      <Navbar></Navbar>
      <div className="landingpage_dashbord"> 
      <div className="container"> 
        <main>
          <div className="recent-orders"> 
          <Button className ="btn" type="primary" size={"small"} onClick={addUser} >add user</Button>
          <table className="tables">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th className="mail-hidden">EMAIL</th>
              </tr>
            </thead>

            <tbody>
            {user.map((val) => {
                    return (
                      <tr>
                        <td>{val.user_id}</td>
                        <td>{val.user_name}</td>
                        <td>{val.email}</td>
                        <td>
                          <Link className="warning" to="/Dashbord/port" state={{id:val.user_id}}>Show port</Link>
                        </td>
                      </tr>
                    )
                  })}
            </tbody>
            </table>
          </div>
        </main>

      </div>
      </div>

      
    </div>
  );
}

export default Dashbord;
