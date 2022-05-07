import axios from "axios"
import { api } from "./api"


export const getData = async () => {
    let adminToken = localStorage.getItem("admin")
    console.log(JSON.parse(adminToken)?.data?.[0]?.accessToken)
    return await axios.get(`${api}admin/getUsers`, {
        headers: {
            Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
        }
    })

}

export const addUser = async (obj) => {
    let adminToken = localStorage.getItem("admin")
    return await axios.post(`${api}admin/addUser`, obj,
        {
            headers: {
                Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        }
    )

}

export const deleteUser = async (e) => {
    let adminToken = localStorage.getItem("admin")
    return await axios.put(`${api}admin/deleteUser/${e}`, {}, {
        headers: {
            Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
        }
    }

    )
}

export const suspendUser = async (e) => {
    let adminToken = localStorage.getItem("admin")
    return await axios.put(`${api}admin/suspendUser/${e.PKUserId}`, {},
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })
}

export const getUser = async (e) => {
    let adminToken = localStorage.getItem("admin")
    return await axios.get(`${api}admin/getUserById/${e.PKUserId}`,
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })
}

export const tempSuspendUser = async (e) => {
    let adminToken = localStorage.getItem("admin")
    return await axios.put(`${api}admin/temporarySuspendUser/${e.PKUserId}`, {},
        {
            headers: {
                Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })

}