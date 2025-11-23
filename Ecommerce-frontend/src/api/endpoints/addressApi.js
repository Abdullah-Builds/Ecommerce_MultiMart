import axiosClient from "../axiosClient";
import Cookies from "js-cookie";

export const address = {
    InsertInfo : (data,token = Cookies.get("token"))=>{
        if (!token) throw new Error("No JWT Token Found");
        return axiosClient.post('/api/addresses',data,{
            headers : {Authorization : `Bearer ${token}`}
        })
    },
    getAddress : ()=>{
        const token = Cookies.get("token");
        if (!token) throw new Error("No JWT Token Found");
        return axiosClient.get('/api/addresses',{
             headers : {Authorization : `Bearer ${token}`}
        })
    }
}