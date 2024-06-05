// AuthService.js
import axios from 'axios';
const API_URL = "http://localhost:8080";
// const API_URL = "http://10.10.10.112:8080/TeamOpsSystem-0.0.1-SNAPSHOT";
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

class AuthService {
    login(values) {
        return axios
            .post(`${API_URL}/users/sign-in`, values)
            .then(response => {
                window.sessionStorage.removeItem(TOKEN_KEY);
                window.sessionStorage.setItem(TOKEN_KEY, response.data.token);

                window.sessionStorage.removeItem(USER_KEY);
                window.sessionStorage.setItem(USER_KEY, JSON.stringify(response.data));

                return response.data;
            })
            .catch(error => {
                console.log("Login Error:", error);
                throw error;
            });
    }

    logout() {
        window.sessionStorage.clear();
        window.location.reload();
    }

    getCurrentUser() {
        return JSON.parse(window.sessionStorage.getItem(USER_KEY));
    }
    getRoles() {
        return this.getCurrentUser()?.roles;
    }
}

export default new AuthService();
