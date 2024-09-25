import axios from "axios";

const API_URL = "https://dummyjson.com/comments";

export const fetchComments = () => axios.get(API_URL);
export const addComment = (comment) => axios.post(`${API_URL}/add`, comment);
export const deleteComment = (id) => axios.delete(`${API_URL}/${id}`);
