import axios from "axios";

const loginService = {
    getToken: async () => {
        const response = await axios.post('http://localhost:8000/api/login', {
            email: 'teste@teste.com',
            password: '12345678'
        })
        return response.data;
    }
}

export default loginService;