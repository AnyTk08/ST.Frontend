import Axios from 'axios';
import secureLocalStorage from "react-secure-storage";

const AxiosConfig = Axios.create({
    baseURL: process.env.REACT_APP_URL,
});

export class AuthToken {

    static get() { return (secureLocalStorage.getItem(`${process.env.REACT_APP_JWT_KEY}`) || null); }
    static set(token: any) { secureLocalStorage.setItem(`${process.env.REACT_APP_JWT_KEY}`, token || ''); }


    static applyFromLocationUrlIfExists() {
        const urlParams = new URLSearchParams(window.location.search);
        const authToken = urlParams.get('authToken');
        if (authToken) {
            this.set(authToken);
            window.history.replaceState({}, document.title, window.location.origin);
        }
    }
}

export class useUnauthorize {
    static get() { return (secureLocalStorage.getItem("permission") || null); }
    static set(IsUse: boolean) { secureLocalStorage.setItem("permission", IsUse || false); }
}

// AxiosConfig.interceptors.request.use(
//     async function (options: any) {
//         const token = AuthToken.get();
//         options.headers['Accept'] = "application/json";
//         options.headers['Content-Type'] = "application/json";

//         if (token) {
//             options.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return options;
//     },
//     function (error) {
//         console.log('Request error: ', error);
//         return Promise.reject(error);
//     },
// );

export default AxiosConfig;
