import { AxiosGet, AxiosPost } from "utilities/ST_Axios";


export const GetDataTable = async (objJSON, fnSuccess, fnError) => {
     AxiosGet("HomeStandard/GetDataTable", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const GetOptionAll = async (objJSON, fnSuccess, fnError) => {
     AxiosGet("HomeStandard/GetOption", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

//#region SDG

export const SaveSDG = async (objJSON, fnSuccess, fnError) => {
     AxiosPost("HomeStandard/OnSaveSDG", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const GetDataSDG = async (objJSON, fnSuccess, fnError) => {
     AxiosGet("HomeStandard/GetDataSDG", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

//#endregion

//#region Occupation

export const SaveOccupation = async (objJSON, fnSuccess, fnError) => {
     AxiosPost("HomeStandard/OnSaveOccupation", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const GetDataOccupation = async (objJSON, fnSuccess, fnError) => {
     AxiosGet("HomeStandard/GetDataOccupation", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

//#endregion

//#region Indicator

export const SaveIndicator = async (objJSON, fnSuccess, fnError) => {
     AxiosPost("HomeStandard/OnSaveIndicator", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const GetDataIndicator = async (objJSON, fnSuccess, fnError) => {
     AxiosGet("HomeStandard/GetDataIndicator", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

//#endregion

//#region BasicInformationForm

export const SaveStandard = async (objJSON, fnSuccess, fnError) => {
     AxiosPost("HomeStandard/OnSaveStandard", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const GetDataStandard = async (objJSON, fnSuccess, fnError) => {
     AxiosGet("HomeStandard/GetDataStandard", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const GetOrder = async (objJSON, fnSuccess, fnError) => {
     AxiosPost("HomeStandard/OnChangeOrder", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}

export const GetOrderSub = async (objJSON, fnSuccess, fnError) => {
     AxiosPost("HomeStandard/OnChangeOrderSub", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}



export const Delete = async (objJSON, fnSuccess, fnError) => {
     AxiosPost("HomeStandard/OnDelete", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}
//#endregion





