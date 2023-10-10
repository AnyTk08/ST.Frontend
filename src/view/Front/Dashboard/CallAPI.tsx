import { AxiosGet, AxiosPost } from "utilities/ST_Axios";

export const GetDataSearchProject = async (objJSON, fnSuccess, fnError) => {
     AxiosPost("Dashboard/GetDataSearchProject", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const GetInitailData = async (objJSON, fnSuccess, fnError) => {
     AxiosGet("Dashboard/GetInitailData", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const GetProvice = async (objJSON, fnSuccess, fnError) => {
     AxiosGet("Dashboard/GetProviceData", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const GetDistrict = async (objJSON, fnSuccess, fnError) => {
     AxiosGet("Dashboard/GetDistrictData", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const GetSubDistrict = async (objJSON, fnSuccess, fnError) => {
     AxiosGet("Dashboard/GetSubDistrictData", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const ExportExcel = async (objJSON, fnSuccess, fnError) => {
     AxiosPost("Dashboard/ExportExcel", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}
