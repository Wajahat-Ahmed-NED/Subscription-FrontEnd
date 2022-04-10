import React, { useEffect, useState } from 'react'
import axios from "axios";

export default function Renewtoken() {
    const [rows, setRow] = useState([])
    //     https://api.idirect
    // test.com/admin/r
    // enewAccessTok
    // en
    useEffect(() => {
        const adminToken = localStorage.getItem("admin");
        const token = JSON.parse(adminToken)?.tokens?.renewToken;
        const url = process.env.REACT_APP_URL
        // setOpenNew(true);
        const api = "http://" + url + "admin/renewAccessToken"
        axios.post(api, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                console.log(response, 'asdasdasdjashshdjkashkdhaskjhvcv');
                localStorage.setItem("admin", JSON.stringify(response.data));
                // setToken(response);
            })
            .catch(function (error) {
                alert("Email or Password is incorrect")
                // localStorage.clear();
                console.log(error)
            });
    }, []);
    console.log(rows, "get ALL orders");
    return (
        <h1>
            this is renew
        </h1>
    )
}
