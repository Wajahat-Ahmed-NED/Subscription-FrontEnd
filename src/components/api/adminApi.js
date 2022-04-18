import axios from "axios"
import {api} from "./api"

export const profileUpdate = async (params) => {
    let adminToken = localStorage.getItem("admin")
    return await axios.put(`${api}admin/updateProfile`, params,
        {
            headers: {
                Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })
}