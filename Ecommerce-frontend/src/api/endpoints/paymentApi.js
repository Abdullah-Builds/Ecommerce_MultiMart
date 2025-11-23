import axiosClient from "../axiosClient";

export const payment = {
    InsertInfo :(data)=>axiosClient.post('/api/payments',data)
}