
import "../css/home.css";
import "../css/dashbord.css";
import { Button, Form, Input,Modal, message, Popconfirm} from "antd";
import { useState,useEffect } from "react";
import Navbar from "../component/navbar";
import Axios from "axios";
import { Link,useNavigate,createSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
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
    
  }

  async function updateUser(evt){
    //console.log(evt.user_id);
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if(emailRegex.test(email)){
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
  }

  const showEdit = ()=>{
    setIsModalOpenEdit(true);
  }

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if(username!="" && email!="" && port!="" &&emailRegex.test(email) ){
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
          window.location.reload();
        }else if(response.data.msg == "Thisuseralreadyexists"){
          message.warning("This Email already exists");
        }else if(response.data.msg == "Thisportnumberalreadyexists"){
          message.warning("This port number already exists");
        }
      })

      var parms = {
        user_name: username,
        user_email: email,
        message: randomPassword,
      };
      emailjs.send(
          "service_sj6d3dg",
          "template_nw67rcu",
          parms,
          "XB9d1MWKoItKo4POu"
        ).then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
          console.log('FAILED...', error);
        });
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
  async function confirm (user){
    console.log(user);
    await Axios.delete(`https://api-ea.vercel.app/deleteUser/${user}`).then(
      (response) => {
        console.log(response);
        message.success('Delete success');
        window.location.reload();
      }
    );
  };
  const cancel = (e) => {
    message.error('Cancel Delete');
  };

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
              <Form.Item name="email" rules={[{required: true,message: 'Please input email!',},{type: "email",message: "The input is not valid Email!",},]}required>
                <Input onChange={onEmailchange} prefix={<MailOutlined  className="site-form-item-icon" />} placeholder="Email" />
              </Form.Item>
              <Form.Item name="port number" rules={[{required: true,message: 'Please input port number!',},]} required>
                <Input type='text'onKeyPress={(event) => {if (!/[0-9]/.test(event.key)){event.preventDefault();}}}onChange={onPortchange} prefix={<NumberOutlined className="site-form-item-icon" />} placeholder="Port Number" />
              </Form.Item>
            </Form>
          </Modal>

          
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
                    <td className="mail-hidden">{val.email}</td>
                    <td>
                    <Popconfirm
                      title="Delete the user"
                      description="Are you sure to delete this user?"
                      onConfirm={()=>{confirm(val.user_id)}}
                      onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button className ="btn" type="text" danger size={"small"}>delete</Button>
                    </Popconfirm>
                    </td>
                    <td>
                    <Button className ="btn" type="text" size={"medium"} onClick={showEdit} >Edit User</Button>
                    <Modal title="Edit User" open={isModalOpenEdit} onOk={()=>{updateUser(val)}} onCancel={handleCancel}>
                      <Form name="normal_login" className="login-form" initialValues={{ remember: true, }}required>
                        <Form.Item name="username" rules={[{required: true,message: 'Please input name!',},]}>
                          <Input onChange={onNamechange} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item name="email" rules={[{required: true,message: 'Please input email!',},{type: "email",message: "The input is not valid Email!",},]}required>
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
