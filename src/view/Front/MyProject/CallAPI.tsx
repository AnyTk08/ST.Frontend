import { AxiosGet, AxiosPost } from "utilities/ST_Axios";


export const GetDataProjectTable = async (objJSON, fnSuccess, fnError) => {
    AxiosPost("MyProject/GetDataProjectTable", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}
export const GetInitData = async (objJSON, fnSuccess, fnError) => {
    AxiosGet("MyProject/GetInitData", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const onDelete = async (objJSON, fnSuccess, fnError) => {
    AxiosPost("MyProject/OnDelete", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}