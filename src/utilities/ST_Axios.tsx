import axios from "axios";
import { FnDialog, IsNullOrUndefined } from "./ST_Function";
import secureLocalStorage from "react-secure-storage";
import { AuthToken, useUnauthorize } from "config/AxiosConfig";
import { useDispatch } from "react-redux";
import { DialogActionCreators } from "store/redux/DialogAlert";
import BlockUIActionCreators from "store/redux/BlockUI";
import { AlertMsg, AlertTitle } from "config/AlertMsgConfig";


const FnAxios = () => {
    // Can Hadle Popup
    const Dispatch = useDispatch() as any;
   
    const handleErr = (res, status, fnErr?) => {
        Dispatch(BlockUIActionCreators.UnBlockUI());
        if (status === 401) {
            Dispatch(
                DialogActionCreators.OpenDialogError("กรุณา Login เข้าสู่ระบบ !")
            );
        } else {
            Dispatch(DialogActionCreators.OpenDialogError(res ? res.Message : ""));
        }
        if (fnErr) {
            fnErr(res);
        }
    };
    const handleSucc = (res, fnSucc?) => {
        Dispatch(BlockUIActionCreators.UnBlockUI());
        if (res.Message) {
            Dispatch(DialogActionCreators.OpenDialogWarning(res.Message));
        }
        if (fnSucc) {
            fnSucc(res);
        }
    };

    const Post = (sAPI, obj, fnSucc?, fnErr?, fnCom?) =>
        AxiosPost(
            sAPI,
            obj,
            (res) => handleSucc(res, fnSucc),
            (res, s) => handleErr(res, s, fnErr),
            fnCom
        );
    const Get = (sAPI, obj, fnSucc?, fnErr?, fnCom?) =>
        AxiosGet(
            sAPI,
            obj,
            (res) => handleSucc(res, fnSucc),
            (res, s) => handleErr(res, s, fnErr),
            fnCom
        );
    return { Post, Get };
};

export { FnAxios };

export const AxiosPost = async (
    sWebMetodName,
    objJSON,
    fnSuccess?,
    fnError?,
    fnComplete?
) => {
    const auth_token = AuthToken.get();
    let ConfigJwt = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: IsNullOrUndefined(auth_token) ? "" : `Bearer ${auth_token}`,
    };

    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    const baseUrl = process.env.REACT_APP_API_URL;
    const sPathApi = `${baseUrl}api/${sWebMetodName}`;
    const url = new URL(sPathApi, window.location.href);
    const sNewPath = url.origin + url.pathname + url.search;

    await axios
        .post(sNewPath, objJSON, { headers: ConfigJwt })
        .then((res) => {
            ResultAPI(res, null, fnSuccess, fnError);
        })
        .catch((errors) => {
            if (!errors.response) {
                errors.response = { Message: errors.message };
            }
            console.log("errors", errors)
            ResultAPI(errors.response, "", null, fnError);
        })
        .finally(() => {
            if (fnComplete) fnComplete();
        });
};


export const AxiosGet = (
    sWebMetodName: string,
    objJSON,
    fnSuccess?,
    fnError?,
    fnComplete?
) => {
    const auth_token = AuthToken.get();

    let ConfigJwt = {
        Authorization: IsNullOrUndefined(auth_token) ? "" : `Bearer ${auth_token}`,
    };
    const newParam = sWebMetodName;
    const baseUrl = process.env.REACT_APP_API_URL;
    const sPath = `${baseUrl}api/${newParam}`;
    const url = new URL(sPath, window.location.href);
    const sPathApi = url.origin + url.pathname + url.search;

    axios
        .get(sPathApi, {
            headers: ConfigJwt,
            params: objJSON,
            // paramsSerializer: (params : any) => {
            //   return qs.stringify(params);
            // },
        })
        .then((res) => {
            ResultAPI(res, null, fnSuccess, fnError);
        })
        .catch((errors) => {
            if (!errors.response) {
                errors.response = { Message: errors.message };
            }
            ResultAPI(errors.response, "", null, fnError);
        })
        .finally(() => {
            if (fnComplete) fnComplete();
        });
};

export const ResultAPI = (response, MSG_Success, fnOnSuccess?, fnOther?) => {
    if (response) {
        switch (response.status) {
            case 200:
                if (fnOnSuccess) fnOnSuccess(response.data);
                break;
            case 401:
                if (fnOther) fnOther(response.data, response.status);
                Unauthorize();
                break;
            case 404:
            case 500:
                if (fnOther) fnOther(response.data, response.status);
                break;
            default:
                console.log("response", response)
                if (!response.data) response.data = response;
                if (fnOther) fnOther(response.data, response.status);
                break;
        }
    } else {
        if (fnOther) fnOther(null, null);
    }
};

export const Unauthorize = () => {
    // const navigate = useNavigate()
    ClearLocalstorage();
    setTimeout(() => {
        window.location.pathname = `${process.env.PUBLIC_URL}/`;
    }, 3000);
};

export const ClearLocalstorage = () => {
    secureLocalStorage.removeItem("listMenu");
    secureLocalStorage.removeItem("UserInfo");
    secureLocalStorage.removeItem(process.env.REACT_APP_JWT_KEY);
};

export const CheckResourceInjection = (sUrl: string) => {
    let Result = true;
    let r = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);
    Result = r.test(sUrl);
    return Result;
};
export const AxiosPostDownloadFileZip = async (
    sWebMetodName: string,
    objJSON: any,
    fileName: string,
    fnSuccess?: any,
    fnError?: any,
    BlockUI?: any,
    UnBlockUI?: any
) => {
    const baseUrl = process.env.REACT_APP_API_URL;
    const sPathApi = `${baseUrl}api/${sWebMetodName}`;
    const url = new URL(sPathApi, window.location.href);
    const sNewPath = url.origin + url.pathname + url.search;

    let localJwtKey = process.env.REACT_APP_JWT_KEY;

    let auth_token =
        secureLocalStorage.getItem(localJwtKey) != null
            ? secureLocalStorage.getItem(localJwtKey)
            : undefined;
    if (BlockUI) BlockUI();
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    if (CheckResourceInjection(sNewPath)) {
        await axios({
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Company-Token": `${localJwtKey}`,
                Authorization: IsNullOrUndefined(auth_token)
                    ? ""
                    : `Bearer ${auth_token}`,
            },
            method: "post",
            url: sNewPath,
            data: objJSON || {},
            responseType: "blob",
        })
            .then((res) => {
                let filename = res.headers["content-disposition"]
                    .split("filename=")[1]
                    .split(".")[0];
                let extension = res.headers["content-disposition"]
                    .split(".")[1]
                    .split(";")[0];
                let sFilename = `${filename}.${extension}`;

                let blob = new Blob([res.data], {
                    type: "application/zip",
                });
                const link = document.createElement("a");
                link.target = "_blank";
                const objectUrl = URL.createObjectURL(blob);
                link.href = objectUrl;
                link.setAttribute("download", sFilename);
                link.setAttribute("visibility", "hidden");
                link.click();
                link.remove();
                if (fnSuccess) fnSuccess(res);
            })
            .catch((errors) => {
                if (errors) {
                    if (errors.response) {
                        if (errors.response.status === 401) {
                            Unauthorize();
                        } else if (fnError) {
                            fnError(errors);
                        }
                    } else if (fnError) {
                        fnError(errors);
                    }
                } else if (fnError) {
                    fnError(errors);
                }
            })
            .then((res) => {
                if (UnBlockUI) UnBlockUI();
            });
    }
};
export const AxiosPostFileExcel = async (
    sWebMetodName: string,
    objJSON: any,
    fileName: string,
    fnSuccess?: any,
    fnError?: any,
    BlockUI?: any,
    UnBlockUI?: any
) => {
    let localJwtKey = process.env.REACT_APP_JWT_KEY;

    const auth_token = AuthToken.get();
    if (BlockUI) BlockUI();

    const newParam = sWebMetodName;
    const baseUrl = process.env.REACT_APP_API_URL;
    const sPathApi = `${baseUrl}api/${newParam}`;
    const url = new URL(sPathApi, window.location.href);
    const sNewPath = url.origin + url.pathname + url.search;

    if (CheckResourceInjection(sNewPath)) {
        await axios({
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Company-Token": `${localJwtKey}`,
                Authorization: IsNullOrUndefined(auth_token)
                    ? ""
                    : `Bearer ${auth_token}`,
            },
            method: "post",
            url: sNewPath,
            data: objJSON || {},
            responseType: "blob",
        })
            .then((res) => {
                let blob = new Blob([res.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                const link = document.createElement("a");
                link.target = "_blank";
                let objectUrl = URL.createObjectURL(blob);
                link.href = objectUrl;
                link.setAttribute("download", fileName);
                link.setAttribute("visibility", "hidden");
                link.click();
                link.remove();
                if (fnSuccess) fnSuccess(res);
            })
            .catch((errors) => {
                if (errors) {
                    if (errors.response) {
                        if (errors.response.status === 401) {
                            Unauthorize();
                        } else if (fnError) {
                            fnError(errors);
                        }
                    } else if (fnError) {
                        fnError(errors);
                    }
                } else if (fnError) {
                    fnError(errors);
                }
            })
            .then((res) => {
                if (UnBlockUI) UnBlockUI();
            });
    }
};

export const AxiosPostFileOffice = async (
    sWebMetodName,
    objJSON,
    fileName,
    fnSuccess?,
    fnError?,
    BlockUI?,
    UnBlockUI?
) => {
    const baseUrl = process.env.REACT_APP_API_URL;
    const sPathApi = `${baseUrl}api/${sWebMetodName}`;
    const url = new URL(sPathApi, window.location.href);
    const sNewPath = url.origin + url.pathname + url.search;

    let localJwtKey = process.env.REACT_APP_JWT_KEY as string;
    let auth_token =
        secureLocalStorage.getItem(localJwtKey) != null
            ? secureLocalStorage.getItem(localJwtKey)
            : undefined;
    if (BlockUI) BlockUI();
    if (CheckResourceInjection(sNewPath)) {
        await axios({
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Company-Token": `${localJwtKey}`,
                Authorization: IsNullOrUndefined(auth_token)
                    ? ""
                    : `Bearer ${auth_token}`,
            },
            method: "post",
            url: sNewPath,
            data: objJSON || {},
            responseType: "blob",
        })
            .then((res) => {
                var blob = new Blob([res.data], {
                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                });
                let filename = fileName + "";
                const link = document.createElement("a");
                link.target = "_blank";
                var objectUrl = URL.createObjectURL(blob);
                link.href = objectUrl;
                link.setAttribute("download", filename);
                link.setAttribute("visibility", "hidden");
                link.click();
                link.remove();
                if (fnSuccess) fnSuccess(res);
            })
            .catch((errors) => {
                if (errors.response) {
                    if (errors && errors.response && errors.response.status === 401) {
                        Unauthorize();
                    } else if (fnError) {
                        fnError(errors);
                    }
                } else if (fnError) {
                    fnError();
                }
            })
            .then((res) => {
                if (UnBlockUI) UnBlockUI();
            });
    }
};

export const AxiosPostFilePDF = async (
    sWebMetodName,
    objJSON,
    fileName,
    fnSuccess?,
    fnError?,
    BlockUI?,
    UnBlockUI?
) => {
    const baseUrl = process.env.REACT_APP_API_URL;
    const sPathApi = `${baseUrl}api/${sWebMetodName}`;
    const url = new URL(sPathApi, window.location.href);
    const sNewPath = url.origin + url.pathname + url.search;

    let localJwtKey = process.env.REACT_APP_JWT_KEY as string;
    let auth_token =
        secureLocalStorage.getItem(localJwtKey) != null
            ? secureLocalStorage.getItem(localJwtKey)
            : undefined;
    if (BlockUI) BlockUI();
    if (CheckResourceInjection(sNewPath)) {
        await axios({
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Company-Token": `${localJwtKey}`,
                Authorization: IsNullOrUndefined(auth_token)
                    ? ""
                    : `Bearer ${auth_token}`,
            },
            method: "post",
            url: sNewPath,
            data: objJSON || {},
            responseType: "blob",
        })
            .then((res) => {
                var blob = new Blob([res.data]);
                let filename = fileName + "";
                const link = document.createElement("a");
                link.target = "_blank";
                var objectUrl = URL.createObjectURL(blob);
                link.href = objectUrl;
                link.setAttribute("download", filename);
                link.setAttribute("visibility", "hidden");
                link.click();
                link.remove();
                if (fnSuccess) fnSuccess(res);
            })
            .catch((errors) => {
                if (errors.response) {
                    if (errors && errors.response && errors.response.status === 401) {
                        Unauthorize();
                    } else if (fnError) {
                        fnError(errors);
                    }
                } else if (fnError) {
                    fnError();
                }
            })
            .then((res) => {
                if (UnBlockUI) UnBlockUI();
            });
    }
};

export const NoPermission = () => {
  
    const DialogFn = FnDialog(); 
    let useUn = useUnauthorize.get();
    
    if (useUn != true) {
        useUnauthorize.set(true)
        DialogFn.SubmitWarning(AlertTitle.Warning, AlertMsg.NoPermission,() => {
             useUnauthorize.set(false)
            let anchor = document.createElement("a");
            anchor.href = "/homebanner";
            anchor.click();
        })
    }
};

export const GetPermission = async (setPermission, setnMenuPermission? :any ,nMenuID? : number) => {
    let sRoute = window.location.pathname.toLocaleLowerCase().toString();
  
     AxiosGet(`Authen/GetPermission`, { sRoute: sRoute ,nMenuID:nMenuID}, (Result) => {
        console.log("nPermission",Result.nPermission )
      setPermission(Result.nPermission ?? 0)
      setnMenuPermission(Result.listnMenuPermission ?? []);
    });
  };
