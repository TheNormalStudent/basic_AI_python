import axios from 'axios';

const {VITE_BACKEND_BASE_URL}  = import.meta.env;

export const apiInstance = axios.create({
    baseURL: VITE_BACKEND_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
});

apiInstance.interceptors.request.use((config) => {
    console.log(`Fetching URL: ${config.baseURL}${config.url}`);
    console.log('Request Data:', config.data);
    return config;
}); // enable when debugging

export const trainApi = {
    train: (training_params) => apiInstance.post('/train-model', training_params ),
    abort: () => apiInstance.post('/train-model/abort'),
}

export const uploadFile = {
    uploadfile: (formdata) => apiInstance.post('/upload-train-data', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }})
}