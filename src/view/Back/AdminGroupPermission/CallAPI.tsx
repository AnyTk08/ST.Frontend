import { AxiosGet, AxiosPost } from "utilities/ST_Axios";


export const GetDataTable = async (objJSON, fnSuccess, fnError) => {
    await AxiosPost("UserGroupPermission/GetDataTable", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const GetInitData = async (objJSON, fnSuccess, fnError) => {
    await AxiosGet("UserGroupPermission/GetInitData", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}
export const GetUserGroup = async (objJSON, fnSuccess, fnError) => {
    await AxiosPost("UserGroupPermission/GetUserGroup", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const GetPermissionUserRole = async (objJSON, fnSuccess, fnError) => {
    await AxiosPost("UserGroupPermission/GetPermissionUserRole", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}
export const SaveUserRole = async (objJSON, fnSuccess, fnError) => {
    await AxiosPost("UserGroupPermission/SaveUserGroup", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}
export const RemoveDataGroupTable = async (objJSON, fnSuccess, fnError) => {
    await AxiosPost("UserGroupPermission/RemoveDataGroupTable", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}


