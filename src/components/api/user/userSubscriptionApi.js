import axios from "axios"
import { api } from "./api"

export const getSubscription = async () => {
    let adminToken = localStorage.getItem("admin")
    return await axios.get(`${api}user/subscriptionsOfPackages`, {
        headers: {
            "Authorization": `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`
        }
    })
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