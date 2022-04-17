import axios from "axios"
import api from "./api"


let adminToken = localStorage.getItem("admin")
export const getSubscriptions = async () => {

        return await axios.get(`${api}admin/getSubscriptions`,
                {
                        headers: {
                                Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
                        }
                }
        )
}