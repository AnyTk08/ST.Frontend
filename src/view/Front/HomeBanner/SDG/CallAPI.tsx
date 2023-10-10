import { AxiosGet, AxiosPost } from "utilities/ST_Axios";


export const GetDataSDGTable = async (objJSON, fnSuccess, fnError) => {
    AxiosPost("HomeBanner/GetDataSDGTable", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}
export const GetInitData = async (objJSON, fnSuccess, fnError) => {
    AxiosGet("HomeBanner/GetInitData", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

