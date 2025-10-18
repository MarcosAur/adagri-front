
import axios from 'axios'
import { useRouter } from 'vue-router';

const router = useRouter();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://seu-backend.com/api',
})

api.interceptors.response.use(
  response => response, 
  error => {
    if (error.response && error.response.status === 401) {
      
      localStorage.removeItem('token')
      window.location.replace('/login')
    }
    return Promise.reject(error)
  }
)

export default api