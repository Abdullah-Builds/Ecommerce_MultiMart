// /api/analytics/salesCat
import axiosClient from "../axiosClient";
import Cookies from "js-cookie";

export const analytics = {
    getRevenueByCategory : ()=>{
        const token = Cookies.get("token");
        if(!token) throw new Error ("No JWT Token Found");
        return axiosClient.get('/api/analytics/salesCat',{
            headers : {Authorization : `Bearer ${token}`}
        })
    },
     getTodaysRevenue : ()=>{
        const token = Cookies.get("token");
        if(!token) throw new Error ("No JWT Token Found");
        return axiosClient.get('/api/analytics/revDay',{
            headers : {Authorization : `Bearer ${token}`}
        })
    },
    getCustomers : ()=>{
        const token = Cookies.get("token");
        if(!token) throw new Error ("No JWT Token Found");
        return axiosClient.get('/api/analytics/customers',{
            headers : {Authorization : `Bearer ${token}`}
        })
    },
    getUsersInfo : ()=>{
         const token = Cookies.get("token");
        if(!token) throw new Error ("No JWT Token Found");
        return axiosClient.get('/api/analytics/salesinfo',{
            headers : {Authorization : `Bearer ${token}`}
        })
    },
     getUsers : ()=>{
        const token = Cookies.get("token");
        if(!token) throw new Error ("No JWT Token Found");
        return axiosClient.get('/api/analytics/users',{
            headers : {Authorization : `Bearer ${token}`}
        })
    },
    getStock : ()=>{
        const token = Cookies.get("token");
        if(!token) throw new Error ("No JWT Token Found");
        return axiosClient.get('/api/analytics/stocks',{
            headers : {Authorization : `Bearer ${token}`}
        })
    }
}