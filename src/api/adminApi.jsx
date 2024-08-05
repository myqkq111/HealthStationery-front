// src/api/adminApi.jsx
import axios from "axios";

export const getProducts = () => axios.get("/api/products");
export const addProduct = (productData) =>
  axios.post("/api/products", productData);
export const updateProduct = (productId, productData) =>
  axios.put(`/api/products/${productId}`, productData);
export const deleteProduct = (productId) =>
  axios.delete(`/api/products/${productId}`);

export const getMembers = () => axios.get("/api/members");
export const addMember = (memberData) => axios.post("/api/members", memberData);
export const updateMember = (memberId, memberData) =>
  axios.put(`/api/members/${memberId}`, memberData);
export const deleteMember = (memberId) =>
  axios.delete(`/api/members/${memberId}`);
