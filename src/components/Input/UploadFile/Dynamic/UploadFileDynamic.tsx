/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Button, FormHelperText } from "@mui/material";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { Extension, IsNullOrUndefined , FnDialog} from "utilities/ST_Function";
import { AlertTitle, AlertMsg } from 'config/AlertMsgConfig'
import { AuthToken } from "config/AxiosConfig";
import { SwAlert } from "components/Alert";
import { useFormContext} from "react-hook-form";
import { DynamicUploadProps, cFile } from "../UploadFileProps";
import DisplayListRow from "../components/List/DisplayListRow";
import i18n from "config/i18nConfig";


const UploadFileDynamic = (props: DynamicUploadProps) => {

    const { name } = props;

    const {
        register,
        setValue,
        formState: { errors },
    } = useFormContext();

    const DialogFn = FnDialog();
    const [arrFileUpload, setarrFileUpload] = useState(props.arrFile ?? [] as cFile | any);

    const [arrExtension, setarrExtension] = useState(props.Extension as any | any);
    const [nLimitFile, setnLimitFile] = useState(props.nLimitFile ?? 10);
    const [sLimitFile] = useState(props.sLimitFile ?? "MB");
    const [sExtension, setsExtension] = useState("");
    const [IsCompleted, setIsCompleted] = useState(false);
    const [arrMimeType, setarrMimeType] = useState([]);
    const [arrSentFileComplete, setarrSentFileComplete] = useState([]);
    const [sAccept, setsAccept] = useState("");



    useEffect(() => {
        if (arrFileUpload.length === 0 && props.arrFile  && props.arrFile.length > 0) {
            setarrFileUpload(props.arrFile);
        }
    }, [props.arrFile])

    //#region useEffect

    useEffect(() => {
        let arrTemp = [];
        let arrExt = [Extension as any];
        if (arrExtension) {
            let arrExtTemp = [];
            arrExt.forEach((f) => {
                for (var key in f) {
                    let i = 0;
                    for (var v in f[key]) {
                        if (f[key][i] !== null && f[key][i] !== "") {
                            arrTemp.push(f[key][i]);
                        }
                        i++;
                    }
                }
            });
            arrTemp.push(arrExtTemp);
            setarrExtension([arrTemp]);
        }
        else {
            arrTemp = arrExtension;
            setarrExtension([arrTemp]);
        }
        let sFileType = "", sAcceptTemp = "";
        arrTemp.forEach((f, inx) => {
            if (f !== "") {
                sFileType += (inx === 0 ? "." : ", .") + f;
                if (sAcceptTemp !== "") {
                    sAcceptTemp += ", ";
                }
                sAcceptTemp += "." + f;
            }
        });
        setsExtension(sFileType);
        setsAccept(sAcceptTemp);
        if (props.nLimitFile) { setnLimitFile(props.nLimitFile); }
    }, []);

    useEffect(() => {
        if(props.arrFile)
        {
            let isCheckFile = arrMimeType.length > 0 && props.arrFile.length > 0 && arrMimeType.length === props.arrFile.length;
            if (isCheckFile) {
                if (arrMimeType.indexOf(false) === -1) {
                    props.arrFile.forEach(async (f, indx) => {
                        await SendAPIFile(f, indx);
                        setarrMimeType([]);
                    });
                }
                else {
                    // Delete file not upload
                    clearNotUploadFile();
                    setarrMimeType([]);
                }
            }
        }
    }, [arrMimeType]);

    useEffect(() => {
        console.log("arrFileUpload IsCompleted", name, arrFileUpload,);
        if (arrFileUpload) {
            if (arrFileUpload.length > 0) {
                console.log("Value");
                setValue(name, "Value")
            }
            else {
                console.log("null");
                setValue(name, null)
            }
        }

        let DataLst = arrFileUpload.filter((f) => f.IsCompleted === true);
        if (props.arrFile) {
            props.arrFile = DataLst;
        }
    }, [IsCompleted]);

    //#endregion

    //#region Function
    const CheckMimeFileType = async (arrFile) => {
        //#region Check MIME FILE 2
        if (window.FileReader && window.Blob) {
            const loadMime = (file, callback) => {
                let mimes = [
                    {
                        mime: "image/jpeg",
                        pattern: [0xff, 0xd8, 0xff],
                        mask: [0xff, 0xff, 0xff],
                    },
                    {
                        mime: "image/png",
                        pattern: [0x89, 0x50, 0x4e, 0x47],
                        mask: [0xff, 0xff, 0xff, 0xff],
                    },
                    {
                        mime: "image/gif",
                        pattern: [0x47, 0x49, 0x46, 0x38],
                        mask: [0xff, 0xff, 0xff, 0xff],
                    },
                    {
                        mime: "application/pdf",
                        pattern: [0x25, 0x50, 0x44, 0x46],
                        mask: [0xff, 0xff, 0xff, 0xff],
                    },
                    {
                        mime: "video/avi",
                        pattern: [0x52, 0x49, 0x46, 0x46], //+ 41 56 49 20
                        mask: [0xff, 0xff, 0xff, 0xff],
                    },
                    {
                        mime: "text/plain UTF-16BE BOM",
                        pattern: [0xfe, 0xff, 0x00, 0x00],
                        mask: [0xff, 0xff, 0x00, 0x00],
                    },
                    {
                        mime: "text/plain UTF-16LE BOM",
                        pattern: [0xff, 0xfe, 0x00, 0x00],
                        mask: [0xff, 0xff, 0x00, 0x00],
                    },
                    {
                        mime: "text/plain UTF-8 BOM",
                        pattern: [0xef, 0xbb, 0xbf, 0x00],
                        mask: [0xff, 0xff, 0xff, 0x00],
                    },
                ];

                const check = (bytes, mime) => {
                    for (var i = 0, l = mime.mask.length; i < l; ++i) {
                        if ((bytes[i] && mime.mask[i]) - mime.pattern[i] !== 0) {
                            return false;
                        }
                    }
                    return true;
                };

                let blob = file.slice(0, 4); //read the first 4 bytes of the file

                let reader = new FileReader();
                reader.onloadend = function (e: any) {
                    if (e.target.readyState === FileReader.DONE) {
                        let bytes = new Uint8Array(e.target.result);
                        for (let i = 0, l = mimes.length; i < l; ++i) {
                            if (check(bytes, mimes[i])) return callback(mimes[i].mime);
                        }

                        return callback("unknown");
                    }
                };
                reader.readAsArrayBuffer(blob);
            };

            arrFile.forEach((file) => {
                if (file.IsNew) {
                    //New File
                    loadMime(file, function (mime) {
                        if (mime) {
                            let arrMimeFileType = mime.split("/");
                            let isCheckType = arrMimeFileType.length > 0 && arrExtension[0].indexOf(arrMimeFileType[1]) > -1;
                            if (isCheckType) {
                                // ถูก Type
                                let arrTemp = arrMimeType;
                                arrTemp.push(true);
                                setarrMimeType([...arrTemp]);
                            }
                            else {
                                let arrTemp = arrMimeType;
                                arrTemp.push(false);
                                setarrMimeType([...arrTemp]);
                                DialogFn.SubmitWarning(`Original file type not include in "${sExtension}" !`);
                                return false;
                            }
                        }
                    });
                } else {
                    //Old File ไม่ต้องเช็ค Mime Type
                    let arrTemp = arrMimeType;
                    arrTemp.push(true);
                    setarrMimeType([...arrTemp]);
                }
            });
        } else {
            console.log("Can't Check MIME Type");
        }

        //#endregion
    };

    const SendAPIFile = async (itemFile, index = 1) => {

        if (!itemFile.IsCompleted) {
            const formPayload = new FormData();
            itemFile.IsProgress = true;
            itemFile.sProgress = "0";
            formPayload.append("file", itemFile);
            if (props.dataID) {
                formPayload.append("dataID", props.dataID);
            }
            setIsCompleted(false);
            try {
                DialogFn.BlockUI();
                const auth_token = AuthToken.get();

                const newParam = props.apiPath ? props.apiPath : "UploadFileSevice/UploadFileToTemp"
                const baseUrl = process.env.REACT_APP_API_URL
                const sPathApi = `${baseUrl}api/${newParam}`
                const url = new URL(sPathApi, window.location.href);

                const sNewPath = url.origin + url.pathname + url.search;

                await axios({
                    url: sNewPath,
                    method: "post",
                    data: formPayload,
                    params: {
                        sFolderTemp: props.sFolderTemp ?? "",
                        isResize: props.IsResize ?? false,    //Image Only
                        nWidthResize: props.WidthResize ?? null,
                        nHeigthResize: props.HeigthResize ?? null,
                        nIndex: index,
                    },
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: IsNullOrUndefined(auth_token) ? "" : `Bearer ${auth_token}`,
                    },
                    onUploadProgress: (progressEvent) => {
                        const { loaded, total } = progressEvent;

                        const percentageProgress = Math.floor((loaded / total) * 100);
                        itemFile.sProgress = percentageProgress + "";
                        itemFile.IsCompleted = false;
                        setIsCompleted(false);
                    },
                })
                    .then(function (response) {
                        DialogFn.UnBlockUI();
                        itemFile.sMsg = response.data.sMsg
                        itemFile.IsCompleted = response.data.IsCompleted;

                        if (response.data.IsCompleted) {
                            itemFile.IsProgress = false;
                            itemFile.sFileLink = response.data.sFileLink;
                            itemFile.sRootURL = process.env.REACT_APP_API_URL;
                            itemFile.sFolderName = "";
                            itemFile.sFileName = response.data.sFileName;
                            itemFile.sSysFileName = response.data.sSaveToFileName;
                            itemFile.IsNewTab = false;
                            itemFile.sPath = response.data.sPath;
                            itemFile.sSaveToPath = response.data.sSaveToPath;
                            itemFile.sUrl = response.data.sUrl;
                            itemFile.nID = response.data.nID;
                            setIsCompleted(true);

                            let arrComplete = arrSentFileComplete;
                            arrComplete.push(true);
                            setarrSentFileComplete([...arrComplete]);
                        }
                    })
                    .catch(function (error) {
                        console.log("error : ", error);
                        setIsCompleted(false);
                        itemFile.IsProgress = false;
                        itemFile.IsCompleted = false;
                    });
            } catch (error) {
                itemFile.IsProgress = false;
                itemFile.IsCompleted = false;
            }
        }
        return itemFile;
    };

    const onDeleteFileInLocation = async (nFile_ID) => {

        let oFileID = props.arrFile.filter(f => f.nFile_ID === nFile_ID);
        if (oFileID.length > 0) {
            let sPath = oFileID[0].sPath + "/" + oFileID[0].sSysFileName;
            let Param = {
                sPath: sPath
            }
            const auth_token = AuthToken.get();

            const baseUrl = process.env.REACT_APP_API_URL
            const sPathApi = `${baseUrl}api/UploadFileSevice/DeleteInTemp`
            const url = new URL(sPathApi, window.location.href);
            const sNewPath = url.origin + url.pathname + url.search;

            axios({
                url: sNewPath,
                method: "post",
                params: Param,
                headers: { Authorization: IsNullOrUndefined(auth_token) ? "" : `Bearer ${auth_token}` },
            })
        }
    }

    const clearNotUploadFile = () => {
        //Delete arrFile
        let arrTemp = props.arrFile.filter((f) => f.IsCompleted === true);
        setarrFileUpload(arrTemp);
    };

    const handleClickFile = async (arrFile) => {
        console.log("arrFile",arrFile);
        let ExtImage = props.Extension == Extension.Image;
        if (ExtImage) {
            //ถ้าแนบไฟล์แบบ Image ให้เช็ค Original File ด้วย
            //Check Mime Type
            CheckMimeFileType(arrFile);
            setarrFileUpload(arrFile);
        }
        else {
            await Promise.all(arrFile.map(async (itemFile, ind) => {
                if (!itemFile.IsCompleted && itemFile.IsNew) {
                    let data = await SendAPIFile(itemFile, ind);
                    itemFile = data
                    setarrMimeType([]);
                }
            }));
        }
    };

    const handleClickDeleteFile = (nFile_ID) => {
        SwAlert.Confirm(AlertTitle.Confirm, AlertMsg.ConfirmDelete, () => {

            let arrNew = props.arrFile.filter(w => w.nFile_ID !== nFile_ID);
            setarrFileUpload(arrNew);
            // Axios Delete File 
            onDeleteFileInLocation(nFile_ID)
        })

    };

    const handleClick = (event) => {
        document.getElementById("contained-button-file" + props.keyID || "").click()
    };

    const onHandleUploadFile = async (e) => {
        let arrTemp = [] as any;
        if(props.arrFile)
        {
            arrTemp = [...props.arrFile];
        }

        let arrNewFile = [] as cFile | any;
        let nSizeFileType = sLimitFile === "GB" ? 1000000000 : 1000000;

        //Check File Size
        for (let i = 0; i < e.target.files.length; i++) {
            if (parseInt((e.target.files[i].size / nSizeFileType).toFixed(1)) > nLimitFile) {
                e.preventDefault();
                SwAlert.Warning(AlertTitle.Warning, `ขนาดไฟล์สูงสุดไม่เกิน ${nLimitFile} ${sLimitFile}.`, () => { });
                return false;
            }
        }
        for (let i = 0; i < e.target.files.length; i++) {
            const dNow = new Date();
            let genID = dNow.getMinutes() + dNow.getSeconds() + dNow.getMilliseconds() + "";

            let objFile = e.target.files[i] as cFile | any;

            objFile.sFileName = e.target.files[i].name;
            objFile.nFile_ID = i + "_" + genID;
            objFile.IsCompleted = false;
            objFile.IsProgress = true;
            objFile.sSizeName = (e.target.files[i].size / nSizeFileType).toFixed(1) + "MB";
            objFile.sFolderName = objFile.webkitRelativePath != "" ? objFile.webkitRelativePath.replace("/" + objFile.sFileName, "") : "";
            objFile.sProgress = "0";

            let arrfilename = (objFile.sFileName + "").split(".");
            objFile.sFileType = arrfilename[arrfilename.length - 1].toLowerCase();
            objFile.IsNew = true;
            arrTemp.push(objFile);
            arrNewFile.push(objFile);
        }
        e.target.files = null;
        let IsPass = true, IsPassName = true, IsPassNameOthre = true;

        arrTemp.forEach((item) => {
            if (arrExtension[0].indexOf(item.sFileType) < 0) {
                IsPass = false;
            }

            let arrFileName = item.sFileName.split("_");
            if (!IsNullOrUndefined(props.sFileName)) {
                if (arrFileName.length > 2) {
                    if (!IsNullOrUndefined(props.sFileName)) {
                        if (arrFileName[0].toLowerCase() != props.sFileName.toLowerCase()) {
                            IsPassName = false;
                        }
                    } else {
                        if (arrFileName[0].toLowerCase() === "sessions") {
                            IsPassNameOthre = false;
                        }
                    }
                } else {
                    IsPassName = false;
                }
            } else {
                if (arrFileName[0].toLowerCase() === "sessions") {
                    IsPassNameOthre = false;
                }
            }
        });

        if (!IsPass) {
            clearNotUploadFile();
            e.preventDefault();
            DialogFn.Warning(i18n.t("uploadfile.OnlyFile") + sExtension + " !");
        }
        else {
            if (!IsPassName && !IsNullOrUndefined(props.sFileName)) {
                clearNotUploadFile();
                e.preventDefault();
                DialogFn.SubmitWarning(`อัปโหลดไฟล์ "` + props.sFileName + `" เท่านั้น`);
            }
            else {
                if (IsNullOrUndefined(props.sFileName)) {
                    if (!IsPassNameOthre) {
                        clearNotUploadFile();
                        e.preventDefault();
                        DialogFn.SubmitWarning(`Upload can't file name sessions.`);
                    }
                    else {
                        setarrFileUpload(arrTemp);

                        await handleClickFile(arrTemp);
                    }
                }
                else {
                    setarrFileUpload(arrTemp);
                    await handleClickFile(arrTemp);
                }
            }
        }
    }
    //#endregion

    return (
        <Fragment>
            <Typography>
                <span
                    style={{
                        fontWeight: 400,
                        fontSize: "1em",
                        color: "rgba(0, 0, 0, 0.6)",
                    }}
                >
                    {props.sTitle || ""}
                </span>
                {props.sTitle && props.IsRequired && <span style={{ color: "red" }}> *</span>}
                {props.sSubTitle && <span style={{ fontSize: "13px", color: "#B3B3B3" }}>{props.sSubTitle}</span>}
            </Typography>
            <Grid container spacing={1} justifyContent="flex-start" alignItems="center" style={props.IsHiddenUploadBox ? { display: "none" } : { paddingTop: "0px" }}>
                <Grid item xs={12} sm={'auto'} >
                    <Button
                        variant="contained"
                        size="small"
                        {...register(name, {
                            required: true
                        })}
                        onClick={handleClick}
                        startIcon={<CloudUploadIcon />}
                        disabled={props.disabled}
                        sx={{
                            paddingTop: "8px !important",
                            paddingBottom: "8px !important",
                            color: "#fff ",
                            backgroundColor: "#00478f",
                            borderColor: "#00478f",
                            "&:hover": {
                                backgroundColor: "rgb(3, 90, 148)",
                            },
                        }}
                    >
                        Upload file
                    </Button>
                    <input
                        id={"contained-button-file" + props.keyID || ""}
                        name={"contained-button-file" + props.keyID || ""}
                        multiple={props.IsMultiple}
                        type="file"
                        hidden
                        onChange={ async (e) => { await onHandleUploadFile(e) }}
                        onClick={(e: any) => { e.target.value = ""; }}
                        accept={sAccept}
                    />
                </Grid>
                <Grid item xs={12} md={'auto'} >
                    <Typography variant="caption">
                        {`Allowed file types: ${sExtension}`}<br />{`File size limits up to ${nLimitFile} ${sLimitFile}`}
                    </Typography>
                </Grid>
                {
                    props.sRemark ?
                        <Grid item xs={12} sm={'auto'}>
                            <Typography variant="caption" >
                                {props.sRemark}
                            </Typography>
                        </Grid>
                        : null
                }
                {
                    errors && errors[name] ?
                        <Grid item xs={12} >
                            <FormHelperText sx={{ color: "red" }}>
                                {String(errors[name].message)}
                            </FormHelperText>
                        </Grid>
                        : null
                }
            </Grid>
            {/* Display File Upload */}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <DisplayListRow
                        arrFile={props.arrFile}
                        // SetarrFile={setarrFileUpload}
                        onDelete={handleClickDeleteFile}
                        IsCanDel={props.IsCanDel ? props.IsCanDel : true}
                        IsDrag={props.IsDrag || false}
                        disabled={props.disabled}
                        isReload={props.IsReload}
                        IsHiddenUploadBox={props.IsHiddenUploadBox}
                    />
                </Grid>
            </Grid>
        </Fragment>
    );
};
export default UploadFileDynamic;
