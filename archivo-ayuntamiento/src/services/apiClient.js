import axios from 'axios';

 const  apiClient = axios.create({
    baseURL: 'https://api-ayuntamientototutla-production.up.railway.app/',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const apiService = {
    get(endpoint, params = {}) {
      return apiClient.get(endpoint, { params });
    },
  
    getById(endpoint, id) {
        return apiClient.get(`${endpoint}/${id}`);
    },

    // Método para enviar datos a un endpoint
    post(endpoint, data) {
      return apiClient.post(endpoint, data);
    },
  
    put(endpoint, id, data) {
        return apiClient.put(`${endpoint}/${id}`, data);
      },
    
      delete(endpoint, id) {
        return apiClient.delete(`${endpoint}/${id}`);
      },
  };

  export default apiService;
