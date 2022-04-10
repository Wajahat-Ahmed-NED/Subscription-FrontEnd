import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';

export default function Allcustomers() {

    const [data, setData] = useState([])
    const url = process.env.REACT_APP_URL;
    let token = JSON.parse(localStorage.getItem('admin'));
    token = token.tokens.accessToken
    console.log(token)
    console.log(url)
    const getData = async () => {
        const api = "http://" + url + "/admin/customers"
        await fetch(api, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then((res) => res.json())
            .then((res) => {
                console.log(res)
                setData(res)
            })
            .catch((err) => console.log("This error occured ", err))

    }


    return (
        <>
            <div className="container my-5">

                <h1 className='text-center'>Admins Details</h1>

                <table class="table table-striped table-hover my-5">

                    <thead>
                        <tr>
                            <td>Cust ID</td>
                            <td>First Name</td>
                            <td>Last Name</td>
                            <td>Gender</td>
                            <td>City</td>
                            <td>Email Address</td>
                            <td>Email Verification</td>
                            <td>Mobile No</td>
                            <td>Date Of Birth</td>

                        </tr>
                    </thead>
                    <tbody>

                        {
                            data.map((e, i) => {
                                return (
                                    <tr key={i}>

                                        <td>{e.PKCustomerID}</td>
                                        <td>{e.FirstName}</td>
                                        <td>{e.LastName}</td>
                                        <td>{e.Gender}</td>
                                        <td>{e.City}</td>
                                        <td>{e.EmailAddress}</td>
                                        <td>{e.EmailVerified}</td>
                                        <td>{e.MobileNumber}</td>
                                        <td>{e.DateOfBirth}</td>

                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            </div>
        </>
    )
}
