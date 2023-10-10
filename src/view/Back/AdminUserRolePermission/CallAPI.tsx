import { AxiosPost } from "utilities/ST_Axios";


export const GetDataTable = async (objJSON, fnSuccess, fnError) => {
    await AxiosPost("UserRolePermission/GetDataTable", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}
export const GetUserRole = async (objJSON, fnSuccess, fnError) => {
    await AxiosPost("UserRolePermission/GetUserRole", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const SaveUserRole = async (objJSON, fnSuccess, fnError) => {
    await AxiosPost("UserRolePermission/SaveUserRole", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}


