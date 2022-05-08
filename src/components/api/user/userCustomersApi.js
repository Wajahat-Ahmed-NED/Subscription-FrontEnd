import axios from "axios"
import { api } from "./api"

export const addCustomer = async (params) => {
    let adminToken = localStorage.getItem("admin")
    return await axios.post(`${api}user/addCustomer`, params,
        {
            headers: {
                Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        }
    )

}

export const getCustomerBySubscriptionId = async (e) =>{
    let adminToken = localStorage.getItem("admin")
     return await axios.get(`${api}user/customerBySubscriptionId/${e}`, {
            headers:{
                'Authorization' : `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`
            }
        })
}

export const editCustomer = async (id,params) => {
    let adminToken = localStorage.getItem("admin")
    return await axios.put(`${api}user/updateCustomer/${id}`, params,
        {
            headers: {
                Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        }
    )

}

export const deleteCustomer = async (e) => {
    let adminToken = localStorage.getItem("admin")
    return await axios.put(`${api}user/deleteCustomer/${e}`,{},
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })
}

export const verifyPhoneNumber = async (params) =>{
    let adminToken = localStorage.getItem("admin")
    return await axios.post(`${api}user/verifyCustomerPhoneNumber`, params,
        {
            headers: {
                Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        }
    )
}