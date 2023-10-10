import { AxiosGet } from "utilities/ST_Axios";

export const GetHomeSDG = (objJSON, fnSuccess, fnError) => {
    AxiosGet(`HomeBanner/GetHomeSDG`, objJSON, (res) => {
        fnSuccess(res);
    }, (err) => { fnError(err) });
}

export const GetHomeSDGAll = (objJSON, fnSuccess, fnError) => {
    AxiosGet(`HomeBanner/GetHomeSDGAll`, objJSON, (res) => {
        fnSuccess(res);
    }, (err) => { fnError(err) });
}
