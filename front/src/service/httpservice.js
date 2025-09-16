import axios from "axios";
import config from "../config"
axios.defaults.baseURL = config.apiUrl;
function setDefultCommonHeaders(headerName, value) {
    axios.defaults.headers.common[headerName] = value
    console.log(axios.defaults.headers.common);

}
const httpService = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    patch: axios.patch,
    delete: axios.delete,
    setDefultCommonHeaders
};
export default httpService;