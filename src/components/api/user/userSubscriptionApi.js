import axios from "axios"
import { api } from "./api"

export const getSubscription = async () => {
    let adminToken = localStorage.getItem("admin")
    const res = await axios.get(`${api}user/subscriptionsOfPackages`, {
        headers: {
            "Authorization": `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`
        }
    })
    await axios.get(`${api}user/billsOfSubscriptions`, {
        headers: {
            "Authorization": `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`
        }
    }).then((json)=>{
        res.data.data.push(json?.data?.data)
    })
    console.log("Data delivered is ",res)
    return res
}

export const updateSubscription = async (id,params) =>{
    let adminToken = localStorage.getItem('admin')
    return await axios.put(`${api}user/updateSubscription/${id}`,params,
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })
}

export const getSubscriptionByPkgId = async (id) =>
{
    let adminToken = localStorage.getItem('admin')
    return await axios.get(`${api}user/subscriptionByPackageId/${id}`, {
        headers: {
            "Authorization": `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`
        }
    })
}

export const billUpdation = async (id,params) =>{
    let adminToken = localStorage.getItem('admin')
    return await axios.put(`${api}user/updateBill/${id}`,params,
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })
}