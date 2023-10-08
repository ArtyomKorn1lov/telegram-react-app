import { legacy_createStore } from "redux"
import axios from "axios";
import ServerDataService from "../services/server-data.service";

export const veryfyToken = async () => {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const tokenExpire = localStorage.getItem("tokenExpire");
    if (!token || !refreshToken) {
        return false;
    }
    if (token && new Date(tokenExpire) > new Date()) {
        return true;
    }
    await axios.post(ServerDataService.apiUrl + "api/telegram/refresh",
        {
            login: localStorage.getItem("login"),
            accessToken: localStorage.getItem("accessToken"),
            refreshToken: localStorage.getItem("refreshToken"),
        })
        .then((resp) => {
            console.log("success");
            localStorage.setItem("accessToken", resp.data.accessToken);
            localStorage.setItem("tokenExpire", resp.data.tokenExpire);
        })
        .catch((error) => {
            console.log(error);
            localStorage.clear();
            return false;
        });
    return true;
};

export const getServerUserData = async () => {
    let obj = {
        id: 0,
        login: "",
        name: ""
    };
    const isVeryfy = await veryfyToken();
    if (!isVeryfy) {
        return obj;
    }
    await axios.get(ServerDataService.apiUrl + "api/telegram/getUserData",
        {
            headers: getHeadAuthoriseData()
        })
        .then((resp) => {
            obj = {
                id: resp.data.Id,
                login: resp.data.Login,
                name: resp.data.Name
            };
        })
        .catch((error) => {
            console.log(error);
        });
    return obj;
}

export const getHeadAuthoriseData = () => {
    return {
        login: localStorage.getItem("login"),
        token: localStorage.getItem("accessToken")
    };
};

const reducer = (state = { user: { id: 0, login: "", name: "" }, chatId: 0 }, action) => {
    switch (action.type) {
        case "setUser":
            console.log(action);
            return { ...state, user: action.payload };
        case "logOut":
            localStorage.clear();
            return { ...state, user: { id: 0, login: "", name: "" } };
        case "setChatId":
            return { ...state, chatId: action.payload };
        default:
            return state;
    }
};

export const store = legacy_createStore(reducer);