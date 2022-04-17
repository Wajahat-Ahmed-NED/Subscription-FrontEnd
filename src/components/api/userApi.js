import axios from "axios"
import api from "./api"

let adminToken = localStorage.getItem("admin")
let token = JSON.parse(adminToken)?.data?.[0]?.accessToken
export const getData = async () => {
        console.log("getData")
        return await axios.get(`${api}admin/getUsers`, {
                headers: {
                        Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
                }
        })

}


export const addUser = async (obj) => {
        console.log("getData")
        return await axios.post(`${api}admin/addUser`, obj,
                {
                        headers: {
                                Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
                        }
                }
        )

}


export const deleteUser = async (e) => {
        console.log(token)
        console.log(e)
        console.log("getData")
        return await axios.put(`${api}admin/deleteUser/${e}`, {
                headers: {
                        Authorization: `Bearer  ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
                }
        }

        )
}

export const suspendUser = async (e) => {
        return await axios.put(`${api}admin/suspendUser/${e.PKUserId}`,
                {
                        headers: {
                                Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
                        }
                })
}



export const tempSuspendUser = async (e) => {
        return await axios.put(`${api}admin/temporarySuspendUser/${e.PKUserId}`,
                {
                        headers: {
                                Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
                        }
                })

}