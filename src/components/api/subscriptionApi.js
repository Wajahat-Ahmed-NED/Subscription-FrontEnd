import axios from "axios"
import {api} from "./api"


export const getSubscriptions = async () => {
    let adminToken = localStorage.getItem("admin")
    return await axios.get(`${api}admin/getSubscriptions`,
        {
            headers: {
                Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        }
    )
}

export const getSubscriptionById = async (e) => {
    let adminToken = localStorage.getItem("admin")
    const res = await axios.get(`${api}admin/getSubscriptionById/${e.PKSubscriptionId}`,
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })

    const data = res?.data?.data?.[0];
    const customer= await axios.get(`${api}admin/getCustomerById/${data.FKCustomerId}`,
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })
    data.FKCustomerName=customer?.data?.data?.[0].FirstName +" "+ customer?.data?.data?.[0]?.LastName

    const packageData = await axios.get(`${api}admin/getPackageById/${data.FKPackageId}`,
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })

        
    data.FKPackageName=packageData?.data?.data?.[0].PackageName
    return data;
}