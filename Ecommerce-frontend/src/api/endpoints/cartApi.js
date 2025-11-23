import axiosClient from "../axiosClient";
import Cookies from "js-cookie";

export const cart = {
  getCart: (token=Cookies.get("token")) =>{
    if (!token) throw new Error("No JWT token found");
    return axiosClient.get('/api/cart',{
      headers : {Authorization : `Bearer ${token}`}
    })
  } ,
  addtoCart: (data, token = Cookies.get("token")) => {
    if (!token) throw new Error("No JWT token found");
    return axiosClient.post("/api/cart/items", data, {
      headers: { Authorization: `Bearer ${ token }` },
    });
  },
  updateCart: (id, data, token = Cookies.get("token")) => {
    if (!token) throw new Error("No JWT token found");
    axiosClient.put(`/api/cart/items/${ id }`, data, {
      headers: { Authorization: `Bearer ${ token }` },
    })
  },
  deleteCartItem: (id,token=Cookies.get("token")) => {
    if(!token) throw new Error("No JWT token found");
    axiosClient.delete(`/api/cart/items/${id}`,{
      headers : {Authorization : `Bearer ${token}`}
    })
  },
  deactivateCart: () => axiosClient.patch()
}
