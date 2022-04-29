import axios from "axios"
import {api} from "./api"



export const getCustomers = async () => {
    let adminToken = localStorage.getItem("admin")
    console.log(JSON.parse(adminToken)?.data?.[0]?.accessToken)
    return await axios.get(`${api}admin/getCustomers`,
        {
            headers: {
                Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        }
    )
}

export const getCustomerById = async (e) => {
    let adminToken = localStorage.getItem("admin")
    return await axios.get(`${api}admin/getCustomerById/${e.PKCustomerId}`,
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })
}

export const getCustomerBySubscriptionId = async (e) =>{
    let adminToken = localStorage.getItem("admin")
     return await axios.get(`${api}admin/getCustomerBySubscriptionId/${e}`, {
            headers:{
                'Authorization' : `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`
            }
        })
}