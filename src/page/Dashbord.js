
import "../css/home.css";
import "../css/dashbord.css";
import { Button, Form, Input,Modal,} from "antd";
import { useState,useEffect } from "react";
import Navbar from "../component/navbar";
import Axios from "axios";
import { Link,useNavigate,createSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { message } from "antd";
import { UserOutlined,NumberOutlined ,MailOutlined} from '@ant-design/icons';
import useToken from "./useToken";
import emailjs from "@emailjs/browser";

function Dashbord() {
  const { token, setToken } = useToken();

  const [user,setUser]=useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);

  const [username,setUname] = useState();
  const [email,setEmail] = useState();
  const [port,setPort] = useState();
  const [uid,setUid]=useState();

  if(!token) {
    window.location.replace("https://ea-project-frontend.vercel.app/Signin");
  }
  useEffect(()=>{
    Axios.get("https://api-ea.vercel.app/user").then((res)=>{
        setUser(res.data);
      }
    )
  },[])

  async function deleteUser(user) {
    await Axios.delete(`https://api-ea.vercel.app/deleteUser/${user}`).then(
      (response) => {
        console.log(response);
        window.location.reload();
      }
    );
  }

  async function updateUser(evt){
    console.log(evt.user_id);
    
    await Axios.put("https://api-ea.vercel.app/updateuUserinfo",{
      Userid:evt.user_id,
      Name:username,
      email:email
    }).then((response)=>{
      if (response.data.msg === "update Success") {
        message.success("update data success");
        window.location.reload();
      } else if(response.data.msg === "This email already exists") {
        message.error("This email already exists");
      }

    })
  }

  const showEdit = ()=>{
    setIsModalOpenEdit(true);
  }

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    if(username!="" && email!="" && port!=""){
      const randomPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      Axios.post("https://api-ea.vercel.app/register", {
        username: username,
        email: email,
        password: randomPassword,
        port: port,
      }).then((response) => {
        console.log(response.data.msg);
        console.log('test');
        if (response.data.msg == "registersuccess") {
          message.success("Submit success!");
          var parms = {
            user_name: username,
            user_email: email,
            message: randomPassword,
          };
          emailjs.send(
              "service_sj6d3dg",
              "template_nw67rcu",
              parms,
              "F0sqlbUWHHa7eDrUX"
            ).then(
              (result) => {
                console.log(result.text);
              },
              (error) => {
                console.log(error.text);
              }
            );
          window.location.reload();
        }else if(response.data.msg == "Thisuseralreadyexists"){
          message.warning("This Email already exists");
        }else if(response.data.msg == "Thisportnumberalreadyexists"){
          message.warning("This port number already exists");
        }
      })
    }else{
      alert("Please fill all required fields!")
    }
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenEdit(false);
  };

  function onNamechange(evt) {
    setUname(evt.target.value);
  }
  function onPortchange(evt) {
    setPort(evt.target.value);
  }
  function onEmailchange(evt) {
    setEmail(evt.target.value);
  }
  
  

  return (
    <div>
      <Navbar></Navbar>
      <div className="landingpage_dashbord"> 
      <div className="container"> 
        <main>
          <div className="recent-orders"> 
          
          <Button className ="btn" type="primary" size={"medium"} onClick={showModal} >Add User</Button>
          <Modal title="Add User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Form name="normal_login" className="login-form" initialValues={{ remember: true, }}required>
              <Form.Item name="username" rules={[{required: true,message: 'Please input name!',},]}>
                <Input onChange={onNamechange} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
              </Form.Item>
              <Form.Item name="email" rules={[{required: true,message: 'Please input email!',},]}required>
                <Input onChange={onEmailchange} prefix={<MailOutlined  className="site-form-item-icon" />} placeholder="Email" />
              </Form.Item>
              <Form.Item name="port number" rules={[{required: true,message: 'Please input port number!',},]} required>
                <Input onChange={onPortchange} prefix={<NumberOutlined className="site-form-item-icon" />} placeholder="Port Number" />
              </Form.Item>
            </Form>
          </Modal>

          
          <table className="tables">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th >EMAIL</th>
              </tr>
            </thead>
            <tbody>
              {user.map((val) => {
                return (
                  <tr>
                    <td>{val.user_id}</td>
                    <td>{val.user_name}</td>
                    <td>{val.email}</td>
                    <td> <Button className ="btn" type="text" danger size={"small"} onClick={()=>{deleteUser(val.user_id)}}>delete</Button></td>
                    <td>
                    <Button className ="btn" type="text" size={"medium"} onClick={showEdit} >Edit User</Button>
                    <Modal title="Edit User" open={isModalOpenEdit} onOk={()=>{updateUser(val)}} onCancel={handleCancel}>
                      <Form name="normal_login" className="login-form" initialValues={{ remember: true, }}required>
                        <Form.Item name="username" rules={[{required: true,message: 'Please input name!',},]}>
                          <Input onChange={onNamechange} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item name="email" rules={[{required: true,message: 'Please input email!',},]}required>
                          <Input onChange={onEmailchange} prefix={<MailOutlined  className="site-form-item-icon" />} placeholder="Email" />
                        </Form.Item>
                      </Form>
                    </Modal>
                    </td>
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
