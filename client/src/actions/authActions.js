import {
    GET_ERRORS
} from "./types";
import axios from "axios";

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios.defaults.headers.post["Content-Type"] =
        "application/x-www-form-urlencoded";
    axios
        .post("http://localhost:5000/api/users/register", userData)
        .then(res => history.push('/login'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            }));
}