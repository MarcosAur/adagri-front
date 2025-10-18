import api from "@/config/axios";
import { apiBaseUrl } from "@/setting";

const loginService = {
    getToken: async (loginData) => {

        const response = await api.post(`${apiBaseUrl}/api/login`, {
            email: loginData.email,
            password: loginData.password
        })

        return response.data;
    }
}

export default loginService;