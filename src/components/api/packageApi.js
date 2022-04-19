import axios from "axios"
import {api} from "./api"


let adminToken = localStorage.getItem("admin")
export const getPackages = async () => {
	let adminToken = localStorage.getItem("admin")
	return await axios.get(`${api}admin/getPackages`,
		{
			headers: {
				Authorization: `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
			}
		}
	)
}

export const getPackageById = async (e) => {
	let adminToken = localStorage.getItem("admin")
    return await axios.get(`${api}admin/getPackageById/${e.PKPackageId}`,
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })
}

export const getPackageByUserId = async (e) =>{
	let adminToken = localStorage.getItem("admin")
    return await axios.get(`${api}admin/getPackagesByUserId/${e}`,
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(adminToken)?.data?.[0]?.accessToken}`,
            }
        })
}