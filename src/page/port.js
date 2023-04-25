
import "../css/home.css";
import "../css/dashbord.css";
import { useState,useEffect } from "react";
import Navbar from "../component/navbar";
import Axios from "axios";
import { Link,useNavigate,createSearchParams } from "react-router-dom";
import { NumberOutlined} from '@ant-design/icons';
import { useLocation } from "react-router-dom";
import { message , Popconfirm} from "antd";
import { Button, Form, Input,Modal,} from "antd";

function Port(){
    const location = useLocation();
    const [userid,setUserid]=useState(location.state.id);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        
    }
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = ()=>{
        if(addFrom!=""){
            Axios.post("https://api-ea.vercel.app/addport", {
                Userid: userid,
                portnumber: addFrom
            }).then((response) => {
                if (response.data.msg === "add port number success") {
                    message.success("Add port number success");
                } else {
                    message.error("This port number already exists.");
                }
                window.location.reload();
            });
        }else{
            alert("please enter port number")
        }
        setIsModalOpen(false);
    }
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    function onChangePort(evt){
        setAddfrom(evt.target.value);
    }

    async function confirm(port){
        await Axios.delete(`https://api-ea.vercel.app/deletetran/${port}`).then((res) => {
            console.log(res);
        });
        await Axios.delete(`https://api-ea.vercel.app/deleteOneport/${port}`).then((res) => {
            console.log(res);
        });
        window.location.reload();
    }
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
                <div className="inputportnumber">
                <Button className ="btn" type="primary" size={"medium"} onClick={showModal} >Add port</Button>
                <Modal title="Add Port Number" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <Form name="normal_login" className="login-form" initialValues={{ remember: true, }}required>
                    <Form.Item name="username" rules={[{required: true,message: 'Please input port!',},]}>
                        <Input onKeyPress={(event) => {if (!/[0-9]/.test(event.key)){event.preventDefault();}}} onChange={onChangePort} prefix={<NumberOutlined className="site-form-item-icon" />} placeholder="Port Number" />
                    </Form.Item>
                    </Form>
                </Modal>
                </div>          
                <table className="tables">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th className="mail-hidden">EMAIL</th>
                        <th >PORT NUMBER</th>

                    </tr>
                    </thead>
                    <tbody>
                    {
                        u_port.map((val)=>{
                            return (
                                <tr>
                                <td>{val.user_id}</td>
                                <td>{val.user_name}</td>
                                <td className="mail-hidden">{val.email}</td>
                                <td>{val.port_number}</td>
                                <td> 
                                <Popconfirm
                                    title="Delete the port"
                                    description="Are you sure to delete this port?"
                                    onConfirm={()=>{confirm(val.port_number)}}
                                    onCancel={cancel}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button className ="btn" type="text" danger size={"small"} >delete</Button>
                                </Popconfirm>
                                </td>
                                <td> <Link className="warning" to="/Dashbord/port/transaction" state={{id:val.port_number}}>Show port</Link></td>
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