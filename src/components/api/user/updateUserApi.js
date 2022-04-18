import axios from "axios"
import { api } from "./api"

export const passwordChange = async (params) => {
    let adminToken = localStorage.getItem("admin")
    console.log(JSON.parse(adminToken)?.data?.[0]?.accessToken)
    return await axios.post(`${api}user/changePassword`, params,
        {
            headers: {
                Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })

}


export const profileUpdate = async (params) => {
    let adminToken = localStorage.getItem("admin")
    return await axios.put(`${api}user/updateProfile`, params,
        {
            headers: {
                Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })
}

