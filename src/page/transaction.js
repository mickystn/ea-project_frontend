import "../css/home.css";
import "../css/dashbord.css";
import "../css/transaction.css"
import { LineChart, Line, XAxis, YAxis, CartesianGrid ,Legend} from "recharts";
import { useState,useEffect } from "react";
import Navbar from "../component/navbar";
import Axios from "axios";
import { useLocation } from "react-router-dom";
import { Button } from "antd";
import { DatePicker, Descriptions } from "antd";

import { Pagination } from "antd";

function Transaction(){
    const location = useLocation();
    const [userport,setUserport]=useState(location.state.id);
    const [userData, setUserData] = useState([]);
    const [alltrans,setAlltrans]=useState([]);
    const [graphval,setGraphval] = useState("profit");
    //Pagination
    const [current, setCurrent] = useState(1);
    const [posts, setPosts] = useState();
    const [pages, setPages] = useState();


    const [startValue, setStartValue] = useState();
    const [endValue, setEndValue] = useState();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(()=>{
        Axios.get("https://api-ea.vercel.app/transaction").then((res)=>{
            setAlltrans(res.data)
        })
        Axios.get(`https://api-ea.vercel.app/userid/${location.state.id}`).then((res) => {
            setUserData(res.data);
        });
    },[])
    // filter พอร์ตตรงกันเท่านั้น
    const u_trans = alltrans.filter((obj)=>{
        return obj.port_number==userport;
    }) 
    var transacdata; // ใช้ DATA ตัวนี้!
    if (startValue != null && endValue != null) {
        // check date calendar
        transacdata = u_trans.filter((obj) => {
        var currentDate = obj.time;
        currentDate = currentDate.split(".");
        var timestampCurrDate = new Date(
            currentDate[0],
            currentDate[1] - 1,
            currentDate[2]
        );

        return (
            timestampCurrDate >= startDate &&
            timestampCurrDate <= endDate &&
            obj.port_number === userport
        );
        });
    } else {
        // check date not calendar
        transacdata = u_trans.filter((obj) => {
        return obj.port_number === userport;
        });
    }
    useEffect(() => {
        if (startValue != null) {
            let day = startValue.$D;
            let month = startValue.$d.getMonth();
            let year = startValue.$y;
            var newDate = new Date(year, month, day).getTime();
            setStartDate(newDate);
        }
    }, [startValue]);
    useEffect(() => {
        if (endValue != null) {
            let day = endValue.$D;
            let month = endValue.$d.getMonth();
            let year = endValue.$y;

            var newDate = new Date(year, month, day).getTime();
            console.log(newDate);
            setEndDate(newDate);
        }
    }, [endValue]);

    const dataObj = transacdata.map((val) => {
        return { date: val.time, profit: val.profit ,equity:val.equity ,balance:val.balance};
    });
    var data = dataObj;

    const profit = transacdata.map((val) => {
        return val.profit;
    });
    const balance = transacdata.map((val) => {
        return val.balance;
    });
    function getLine(){
        if(graphval=="profit"){
          return (
            <LineChart   width={500} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid  strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis type="number"></YAxis>
              <Line type="monotone" dataKey="profit" stroke="#8884d8" dot={false}/>
            </LineChart>
            
          )
        }
        else{
          return (
            <LineChart  width={500} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <Legend />
              <YAxis type="number"  domain={[Math.min(...balance) - 100,Math.max(...balance) + 100,]}></YAxis>
              <Line type="monotone" dataKey="equity" stroke="#8884d8" dot={false}/>
              <Line type="monotone" dataKey="balance" stroke="#210062" dot={false}/>
            </LineChart>
            
          )
          
        }
      }

    useEffect(()=>{
        const dataLegth = transacdata.length;
        const page = Math.ceil(dataLegth / 10);
        const post = page * 10;
        setPosts(post);
        setPages(page);
    })
    let dataArray = [];
    dataArray.push(transacdata.slice(0, 10));
  
    let startIndex = 10;
    let endIndex = 20;
  
    for (let i = 0; i < pages; i++) {
      dataArray.push(transacdata.slice(startIndex, endIndex));
      startIndex += 10;
      endIndex += 10;
    }
    const onChangepage = (page) => {
        setCurrent(page);
    };
    function showData(){
        if(dataArray.length<=current){
            return dataArray[0]
        }
        return dataArray[current-1]
    }
    return (
        <div>
            <Navbar></Navbar>
            <div className="landingpage_dashbord"> 
                <div className="container"> 
                    <main>
                    {userData.map((obj) => {
                    return (
                        <div className="Descriptions-info">
                        <Descriptions title="User Info">
                            <Descriptions.Item label="Username" >
                            {obj.user_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email" span={2}>
                            {obj.email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Port Number" span={2}>
                            {obj.port_number}
                            </Descriptions.Item>
                            <Descriptions.Item label="Profit">
                            {(profit[profit.length - 1] - profit[0]).toFixed(2)}
                            </Descriptions.Item>
                        </Descriptions>
                        </div>
                    );
                    })}
                    <div className="recent-orders"> 
                        <div className="chart-info">
                            <div className="btnPlotgraph">
                            <Button className ="btn" type="primary" size={"small"} onClick={()=>{setGraphval("profit")}}>
                            Profit
                            </Button>
                            <Button className ="btn"  type="primary" size={"small"}  onClick={()=>{setGraphval("equity")}}>
                            Equity/Balance
                            </Button>
                            </div>
                            {getLine()}
                        </div>

                        <DatePicker className="DatePicker"format="YYYY-MM-DD" value={startValue} placeholder="Start" onChange={setStartValue}/>
                        <DatePicker className="DatePicker" format="YYYY-MM-DD" value={endValue} placeholder="End" onChange={setEndValue} />

                        <table className="tables">
                                <thead>
                                <tr>
                                    <th>TIME</th>
                                    <th>BALANCE</th>
                                    <th >EQUITY</th>
                                    <th >PROFIT</th>
                                </tr>
                                </thead>

                                <tbody>
                                {
                                    showData().map((val, index) => {
                                        return (
                                        <tr>
                                            <td>{val.time}</td>
                                            <td>{val.balance} </td>
                                            <td>{val.equity}</td>
                                            <td>{val.profit.toFixed(2)} </td>
                                        </tr>
                                        );
                                    })
                                }
                                </tbody>
                        </table>

                        <Pagination className="Pagination" current={current} onChange={onChangepage} total={posts} simple/>

                    </div>
                    </main>
                </div>
            </div> 
        </div>
    )


}

export default Transaction;