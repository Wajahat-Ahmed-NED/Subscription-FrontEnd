import axios from "axios"
import { api } from "./api"

export const addPackage = async (params)=>{
    let adminToken = localStorage.getItem("admin")
    return await axios.post(`${api}user/addPackage`, params,
        {
            headers: {
                Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        }
    )
}

export const getPackage = async ()=>{
    let adminToken = localStorage.getItem("admin")
    return await axios.get(`${api}user/userPackages`, {
            headers: {
                    "Authorization": `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`
            }
    })


}

export const deletePackage = async (e)=>{
    let adminToken = localStorage.getItem("admin")
    return await axios.put(`${api}user/deletePackage/${e}`,{},
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })
}

export const editPackage = async (id,params)=>{
    let adminToken = localStorage.getItem("admin")
    return await axios.put(`${api}user/updatePackage/${id}`,params,
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })
}

export const getPackageById = async (e) => {
	let adminToken = localStorage.getItem("admin")
    return await axios.get(`${api}user/userPackageById/${e.PKPackageId}`,
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })
}

export const sendOtp = async (params) =>{
	let adminToken = localStorage.getItem("admin")
    return await axios.post(`${api}user/sendOtp`, params ,
    {
        headers: {
            'Authorization': `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
        }
    })
}

export const verifySubscription = async (params) =>{
	let adminToken = localStorage.getItem("admin")
    return await axios.post(`${api}user/verifySubscription`, params ,
    {
        headers: {
            'Authorization': `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
        }
    })
}

