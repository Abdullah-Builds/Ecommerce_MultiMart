import axiosClient from "../axiosClient";

export const category = {
    getAllCategories: () => axiosClient.get('/api/categories'),
    createCategory: (data) => axiosClient.post('/api/categories', data),
    updateCategory : (id,data) => axiosClient.put(`api/categories/${id}`,data),
    deleteCategory : (id) => axiosClient.delete(`api/categories/${id}`)
}

