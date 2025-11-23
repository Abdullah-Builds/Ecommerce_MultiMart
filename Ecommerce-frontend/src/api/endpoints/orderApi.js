import axiosClient from "../axiosClient";
import Cookies from "js-cookie";

export const order = {
    InsertInfo: (data) => {
        const token = Cookies.get("token");
        if (!token) throw new Error("No JWT Token Found")
        return axiosClient.post('/api/orders', data, {
            headers: { Authorization: `Bearer ${ token }` }
        })
    }
}