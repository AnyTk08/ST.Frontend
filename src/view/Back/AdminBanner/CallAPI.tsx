import { AxiosGet, AxiosPost } from "utilities/ST_Axios";


export const GetDataTable = async (objJSON, fnSuccess, fnError) => {
     AxiosGet("AdminBanner/GetDataTable", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const GetData = async (objJSON, fnSuccess, fnError) => {
     AxiosGet("AdminBanner/GetDataBanner", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const GetOption = async (objJSON, fnSuccess, fnError) => {
     AxiosGet("AdminBanner/GetOption", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}


export const Save = async (objJSON, fnSuccess, fnError) => {
     AxiosPost("AdminBanner/OnSave", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const Delete = async (objJSON, fnSuccess, fnError) => {
     AxiosPost("AdminBanner/OnDelete", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const GetOrder = async (objJSON, fnSuccess, fnError) => {
     AxiosPost("AdminBanner/OnChangeOrder", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const GetOrderSub = async (objJSON, fnSuccess, fnError) => {
     AxiosPost("AdminBanner/OnChangeOrderSub", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}
