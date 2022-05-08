import axios from "axios"
import { api } from "./api"

export const billGeneration = async (params) =>{
    let adminToken = localStorage.getItem("admin")
    return await axios.post(`${api}user/generateBill`, params ,
    {
        headers: {
            'Authorization': `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
        }
    })
}

export const getBillBySubscriptionId = async (id) =>
{
    let adminToken = localStorage.getItem('admin')
    return await axios.get(`${api}user/billsBySubscriptionId/${id}`, {
        headers: {
            "Authorization": `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`
        }
    })
}