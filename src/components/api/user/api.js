


import axios from 'axios'
import { isJwtExpired } from 'jwt-check-expiration'
// import { displayErrorToast } from '../helper/toast_notification_function'
// import { saveTokens, userState } from '../redux/actions/userActions'

// const apiUrl = process.env.REACT_APP_MAIN_URL

export const api = "http://localhost:5000/"
// export const api
const apiUrl = api

export const axiosHandle = token => {
    let adminToken = localStorage.getItem("admin")
    return axios.create({
        baseURL: `${apiUrl}user`,
        headers: {
            ...axios.defaults.headers,
            Authorization: `Bearer ${token ? token : JSON.parse(adminToken)?.data?.[0]?.accessToken
                }`
        }
    })
}


export const apiHandle = async (adminToken, navigate) => {
    let refreshToken=JSON.parse(adminToken)?.data?.[0]?.refreshToken;
    let token=JSON.parse(adminToken)?.data?.[0]?.accessToken;
    console.log(token)
    if (isJwtExpired(token) === false) {
        return axiosHandle(token)
    } 
    else if (isJwtExpired(token) === true) {
        if (isJwtExpired(refreshToken) === false) {
            await axiosHandle(token)
                .post('/renewAccessToken', {
                    'refreshToken': refreshToken
                })
                .then(async res => {
                    let newToken = JSON.parse(adminToken)
                    const newAccessToken = await res?.data?.data[0]?.['newAccessToken']
                    newToken.data[0].accessToken = newAccessToken
                    localStorage.setItem("admin", JSON.stringify(newToken))
                    // return axiosHandle(newAccessToken)
                }).catch(error => {
                    console.log(error)
                    //   displayErrorToast(error)
                })
        } else {
            //   userState(dispatch, false)
            navigate('/')
        }
    } 
    else {
    }
}

// export const {axiosHandle}
