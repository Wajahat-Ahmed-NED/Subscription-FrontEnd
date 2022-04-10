import React,{useEffect,useState} from 'react';
import ReactToPdf from "react-to-pdf";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import axios from "axios";
import logo from "./assets/images/logo.png";

const ref = React.createRef();

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
  }));


export default function Report(props) {
    const [rows, setRow] = useState([]);
    // console.log(props?.location?.state);

    useEffect(() => {
        const adminToken = localStorage.getItem("admin");
        const token = JSON.parse(adminToken)?.tokens?.accessToken;
             axios.get('https://api.idirecttest.com/admin/getOrderRequisition',{
                params: {
                    orderId: props?.location?.state,
                  },
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                  .then(function(response) {
                    console.log(response.data,'=== getOrderRequisition');
                    setRow(response.data);
                  })
                  .catch(function(error) {
                    alert("Email or Password is incorrect")
                });
         
    },[]);
        

    const options = {
        orientation: 'landscape',
        unit: 'in',
        format: [4,2]
    };
    // style={{width: 900, height: 900, background: 'blue'}}
    return (
        <>
         <ReactToPdf targetRef={ref} filename="Report.pdf">
                {({toPdf}) => (
                    <button onClick={toPdf}>Download PDF</button>
                )}
            </ReactToPdf>
        <div style={{width: 810,marginTop:60,}} ref={ref}>
        <img className="report-logo" src={logo}  alt="logo"/>
        <div className="capture-div">
        {/* <div>logo</div> */}
        {rows && rows.orderRequisition && rows.orderRequisition.map((o) => (
        <table className="table-contant">
            <tr>
                <th className="table-head" colspan="4">CLIENT INFORMATION</th>
            </tr>
            <tr>
                <th className="table-data">Account</th>
                <td className="table-data">TBD</td>
                <th className="table-data">Name</th>
                <td className="table-data">{o.Branch.Title}</td>
            </tr>
            <tr>
                <th className="table-data">Bill Type</th>
                <td className="table-data">TBD</td>
                <th className="table-data">Phone</th>
                <td className="table-data">{o.Branch.PhoneNumber}</td>
            </tr>
            <tr className="table-row" >
                <th className="table-data">Address</th>
                <td className="table-data" colspan="3">{o.Branch.Address}</td>
            </tr>
        </table>
        ))}
        {rows && rows.orderRequisition && rows.orderRequisition.map((item) => (
        <table className="table-contant">
            <tr>
                <th className="table-head" colspan="4">PATIENT INFORMATION</th>
            </tr>
            <tr>
                <th className="table-data">ID</th>
                <td className="table-data">{item.Customer.PKCustomerID}</td>
                <th className="table-data">Expires</th>
                <td className="table-data">05/07/2050</td>
            </tr>
           
            <tr>
                <th className="table-data">Name</th>
                <td className="table-data">{item.Customer.FirstName}-{item.Customer.LastName}</td>
                <th className="table-data">Sex</th>
                <td className="table-data">{item.Customer.Gender}</td>
            </tr>
            <tr>
                <th className="table-data">Date of Birth</th>
                <td className="table-data">{item.Customer.DateOfBirth}</td>
                <th className="table-data">Phone</th>
                <td className="table-data">{item.Customer.MobileNumber}</td>
            </tr>
            <tr className="table-row" >
                <th className="table-data">Address</th>
                <td className="table-data" colspan="3">{item.Customer.Address}</td>
            </tr>
           
        </table>
        ))}
        <table className="table-contant">
            <tr>
                <th className="table-head" colspan="4">PROVIDER</th>
            </tr>
            <tr>
                <th className="table-data">Name</th>
                <td className="table-data">{rows?.physicianIdentity?.physicianName}</td>
                <th className="table-data">NIP</th>
                <td className="table-data">{rows?.physicianIdentity?.NPI}</td>
            </tr>
        </table>
        <table className="table-contant">
            <tr>
                <th className="table-head" >TESTS</th>
                <th className="table-head" >TEST Code</th>
            </tr>
            {rows && rows.filteredOrderItems && rows.filteredOrderItems.map((row) => (
                <tr>
                <td className="table-data">{row.Test_Name}</td>
                <td className="table-data">{row.Test_Code}</td>
                </tr>
            ))}
            <tr>
                <th className="table-head-center" colspan="4">End of Requisition</th>
            </tr>
        </table>
        <div className="test-prep">
            {/* <p className="text-ins">TEST Prep Instructions: </p> */}
        </div>
        <table className="table-contant-bottom">
            <tr>
                <th className="table-head" colspan="4">Disclaimer</th>
            </tr>
            <tr>
                <td className="table-data">These documents may contain confidential information and is intended only for the individual named or purchased these services. It may also
                    be privileged or otherwise protected by work product immunity or other legal rules. If you are not the intended recipient you are notified that
                    disclosing, copying, forwarding or otherwise distributing or taking any action in reliance on the contents of this email and any attachments is
                    strictly prohibited.</td>
            </tr>
        </table>
            </div>
        </div>
        {/* options={options} x={0} y={0} scale={1} */}
            
        </>
    )
}
