import httpService from "./httpservice";
import { jwtDecode } from "jwt-decode";
const TOKEN_KEY = "token";
refreshToken()
function createUser(user) {
    return httpService.post("/users", user)

}


async function login(credentials) {
    try {
        const response = await httpService.post("/users/login", credentials);

        setToken(response.data.token)
        return response;
    } catch (error) {

        throw error;
    }
}
function logout() {
    setToken(null)
}
function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
    refreshToken()
}
function refreshToken() {
    httpService.setDefultCommonHeaders("x-auth-token", getJwt());
}
function getJwt() {
    return localStorage.getItem(TOKEN_KEY)
}
async function getUserbyid(userid) {

    const response = await httpService.get("/users/" + userid);

    return response.data;

}


function getUser() {
    try {
        const token = getJwt();
        return jwtDecode(token)
    } catch {
        return null;
    }

}

getUser()

const userService = {
    createUser,
    login,
    logout,
    getJwt,
    getUser,
    getUserbyid,
    refreshToken
};
export default userService;