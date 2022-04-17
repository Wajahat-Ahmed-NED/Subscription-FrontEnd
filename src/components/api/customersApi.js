import axios from "axios"
import api from "./api"


let adminToken = localStorage.getItem("admin")
export const getCustomers = async () => {

        return await axios.get(`${api}admin/getCustomers`,
                {
                        headers: {
                                Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
                        }
                }
        )
}