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