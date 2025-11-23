import axiosClient from "../axiosClient";
import Cookies from "js-cookie";

export const admin = {
    CheckAccess : ()=>{
        const token = Cookies.get("token");
        if(!token) throw new Error ("No JWT Token Found");
        return axiosClient.get('/api/analytics/stocks',{
            headers : {Authorization : `Bearer ${token}`}
        })
    },
    updateOrderStatus : (id,data)=>{
         const token = Cookies.get("token");
        if(!token) throw new Error ("No JWT Token Found");
        return axiosClient.put(`/api/analytics/orders/${id}`,data,{
            headers : {Authorization : `Bearer ${token}`}
        })
    },
    getOrders : ()=>{
         const token = Cookies.get("token");
        if(!token) throw new Error ("No JWT Token Found");
        return axiosClient.get('/api/analytics/orders',{
            headers : {Authorization : `Bearer ${token}`}
        })
    }
}