{/* <div className="landingpage_dashbord"> 
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
                          <td> <Link to="/Dashbord/port/transaction" state={{id:val.port_number}}>Show port</Link></td>
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
      </div> */}