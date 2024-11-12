import _axios from "axios";

if (import.meta.env.MODE != "development") {
    console.log("Is prod.");
} else {
    console.log("Is dev.");
}

const getBaseURL = () => {
    const method = window.localStorage.getItem('method');
    console.log(method);
    if (method === 'node') {
        return import.meta.env.MODE !== "development"
            ? "http://13.60.117.191:5000/api"
            : "http://13.60.117.191:5000/api";
    } else if (method === 'laravel') {
        return import.meta.env.MODE !== "development"
            ? "http://13.60.117.191:8000/api"
            : "http://13.60.117.191:8000/api";
    } else {
        return import.meta.env.MODE !== "development"
            ? "http://13.60.117.191:8080/api"
            : "http://13.60.117.191:8080/api";
    }
};

const axios = _axios.create({
    // baseURL:
    //     import.meta.env.MODE != "development"
    //         ? "/api"
    //         : "http://localhost:5000/api",
    // baseURL: getBaseURL(),
    timeout: 3000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

axios.interceptors.request.use(
    (config) => {
        config.baseURL = getBaseURL();
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.code == "ECONNABORTED") {
            // Timeout
            return Promise.reject(new Error("Couldn't connect to server"));
        }

        if (error.response && error.response.data) {
            let response = error.response.data;
            if (response.code) {
                // Got a response code in body
                if (response.code == 404) {
                    return Promise.reject(new Error("404 Not found"));
                }
                console.log("Got API error: ", response);
                return Promise.reject(response);
            }
            return Promise.reject(new Error(response.message));
        }
        return Promise.reject(error);
    }
);

export default axios;
