import axiosClient from "../axiosClient";
import Cookies from "js-cookie";

export const admin = {
    CheckAccess : ()=>{
        if(!token) throw new Error ("No JWT Token Found");
        return axiosClient.get('/api/analytics/stocks',{
            headers : {Authorization : `Bearer ${token}`}
        })
    }
}