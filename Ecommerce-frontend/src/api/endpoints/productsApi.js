import axios from "axios";
import axiosClient from "../axiosClient";

export const products = {
    getproducts: () =>  axiosClient.get('/api/products'),
    createProduct: (data) => axiosClient.post('/api/products', data),
    getProductbyID: (id) => axiosClient.get(`/api/products/${ id }`),
    updateProduct : (id,data) => axiosClient.put(`/api/products/${id}`,data),
    deleteProduct : (id) => axiosClient.delete(`/api/products/${id}`),
    getStock : (id) => axiosClient.get(`/api/products/stock/${id}`)
}

