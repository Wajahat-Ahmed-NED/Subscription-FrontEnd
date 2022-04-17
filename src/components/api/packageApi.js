import axios from "axios"
import api from "./api"


let adminToken = localStorage.getItem("admin")
export const getPackages = async () => {

        return await axios.get(`${api}admin/getPackages`,
                {
                        headers: {
                                Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
                        }
                }
        )
}