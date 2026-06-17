import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const getConvocations = () => {
  return API.get("/degree/convocations");
};


export const getBatches = () => {
  return API.get("/degree/batches");
};

export const getDepartments = () => {
  return API.get("/degree/departments");
};

export const getDegrees = () => {
  return API.get("/degree/degrees");
};

export const getSpecializations = () => {
  return API.get("/degree/specializations");
}

export const getStudents = (filters) => {
    return API.post("/degree/students",filters);
};

export const getStudentDetails = (studentMasterId) => {
    return API.get(`/degree/student/${studentMasterId}`);
};