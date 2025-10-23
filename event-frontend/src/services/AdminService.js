import axios from 'axios';

const ADMIN_API_BASE_URL = "http://localhost:8080/api/admins";

class AdminService {
    getAllAdmins() {
        return axios.get(ADMIN_API_BASE_URL);
    }

    createAdmin(admin) {
        return axios.post(ADMIN_API_BASE_URL, admin);
    }
}

export default new AdminService();
