/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Badge, IconButton, ListItemIcon, ListItemText, MenuItem, Popover } from "@mui/material";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Extension, IsNullOrUndefined ,FnDialog} from "utilities/ST_Function";
import { AuthToken } from "config/AxiosConfig";
import { ProfileUploadProps, cFile } from "../UploadFileProps";
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import FilePopup from "../components/PopUp/FilePopup";
import No_BG from "../../../../assets/images/NoImage/no-image-icon-23485.png";
import CropRotateRoundedIcon from '@mui/icons-material/CropRotateRounded';
import { CircularProgressWithLabelProfile } from "../components/StyleCpnExport";
import i18n from "config/i18nConfig";


const ProfileUploadFile = (props: ProfileUploadProps) => {

    const {
      keyID,
      arrFile,
      setarrFile,
      nLimitFile,
      sLimitFile,
      modeDisplay,
      width,
      height,
      IsCrop,
      cropShape,
      cropRatio,
      cropResize,
      cropMovable,
      sPositionText,
      disabled 
    } = props;


    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [arrExtension, setarrExtension] = useState(props.Extension);
    const [sExtension, setsExtension] = useState("");
    const [sAccept, setsAccept] = useState("");
    const [IsCompleted, setIsCompleted] = useState(false);
    const [arrMimeType, setarrMimeType] = useState([]);
    const [IsopenPopUp, setIsopenPopUp] = useState(false)
    const [isSetImageCrop, setisSetImageCrop] = useState(false)
    const [srcImage, setsrcImage] = useState(null)
    const [nProgress, setnProgress] = useState(0)
    const DialogFn = FnDialog();

    useEffect(() => {
        let src = null;
        if (arrFile && arrFile.length > 0) {
            src = arrFile[0];
            setsrcImage(src);
        }

    }, [arrFile, arrFile])


    //#region useEffect

    useEffect(() => {
        let arrTemp = [];
        let arrExt = [Extension as any];
        if (arrExtension === null || arrExtension === undefined) {
            let arrExtTemp = [];
            arrExt.forEach((f) => {
                for (let key in f) {
                    let i = 0;
                    for (let v in f[key]) {
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
    }, []);

    useEffect(() => {
        if (props.onClearFile) {
            props.onClearFile.current = () => {
                handleClickDeleteFile("", false);
                setsrcImage(null)
            };
        }
    }, [props.onClearFile]);

    useEffect(() => {
        let isCheckFile = arrMimeType.length > 0 && arrFile.length > 0 && arrMimeType.length === arrFile.length;
        if (isCheckFile) {
            if (arrMimeType.indexOf(false) === -1) {
                arrFile.forEach(async (f, indx) => {
                    await SendAPIFile(f, indx);
                    setarrMimeType([]);
                });
            }
            else {
                // Delete file not upload
                clearNotUploadFile();
                setarrMimeType([]);
                setsrcImage(null)
            }
        }
    }, [arrMimeType]);

    useEffect(() => {
        if (IsCompleted) {
            let newArrFile = arrFile.filter(w => w.IsCompleted);
            props.setarrFile([...newArrFile]);
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
                    for (let i = 0, l = mime.mask.length; i < l; ++i) {
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

    const SendCropImage = async (sUrl, base64, nFile_ID) => {
        setAnchorEl(null)
        const auth_token = AuthToken.get();
        const newParam = "UploadFileSevice/CropImageUploadFile"
        const baseUrl = process.env.REACT_APP_API_URL
        const sPathApi = `${baseUrl}api/${newParam}`
        const url = new URL(sPathApi, window.location.href);
        const sNewPath = url.origin + url.pathname + url.search;

        await axios({
            url: sNewPath,
            method: "post",
            data: {
                sOldPath: sUrl,
                sBase64: base64
            },
            headers: {
                "Content-Type": "application/json",
                Authorization: IsNullOrUndefined(auth_token) ? "" : `Bearer ${auth_token}`,
            },
        })
            .then(function (response) {
                setIsopenPopUp(false)
                let nIdexFile = arrFile.findIndex(f => f.nFile_ID == nFile_ID);
                if (nIdexFile > -1) {
                    arrFile[nIdexFile].sCropFileLink = response.data.sCropFileLink;
                    arrFile[nIdexFile].sCropPath = response.data.sCropPath;
                    setarrFile([...arrFile])
                    setisSetImageCrop(!isSetImageCrop)
                }
            })
            .catch(function (error) {
                console.log("error Crop : ", error);
            });
    }

    const SendAPIFile = async (itemFile, index = 1) => {
        props.setarrFile([]);

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
                        isResize: false,    //Image Only
                        nWidthResize: null,
                        nHeigthResize: null,
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
                        setnProgress(percentageProgress)
                        itemFile.IsCompleted = false;
                        setIsCompleted(false);
                        props.setarrFile(e => [...e]);
                    },
                })
                    .then(function (response) {
                        itemFile.sMsg = response.data.sMsg
                        itemFile.IsCompleted = response.data.IsCompleted;

                        if (response.data.IsCompleted) {
                            itemFile.IsProgress = false;
                            itemFile.sFileLink = response.data.sFileLink;
                            itemFile.sCropFileLink = response.data.sCropFileLink;
                            itemFile.sCropPath = response.data.sCropPath;
                            itemFile.sRootURL = process.env.REACT_APP_API_URL;
                            itemFile.sFolderName = "";
                            itemFile.sFileName = response.data.sFileName;
                            itemFile.sSysFileName = response.data.sSaveToFileName;
                            itemFile.IsNewTab = false;
                            itemFile.sPath = response.data.sPath;
                            itemFile.sSaveToPath = response.data.sSaveToPath;
                            itemFile.sCrop = response.data.sUrl;
                            itemFile.sUrl = response.data.sUrl;
                            itemFile.nID = response.data.nID;
                            setIsCompleted(true);
                            props.setarrFile(e => [...e]);

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
        // ลบไฟล์ Temp กรณีที่ลบไปก่อนบันทึก
        let oFileID = arrFile.filter(f => f.nFile_ID === nFile_ID);
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
                headers: {
                    Authorization: IsNullOrUndefined(auth_token)
                        ? ""
                        : `Bearer ${auth_token}`,
                },
            })
        }
    }

    const clearNotUploadFile = () => {
        //Delete arrFile
        let arrTemp = arrFile.filter((f) => f.IsCompleted === true);
        setarrFile(arrTemp);
    };

    const handleClickFile = async (arrFileItem) => {
        setarrFile([])
        let arrTemp = [];
        arrFile.forEach(val => arrTemp.push(Object.assign({}, val)));
        arrTemp = [...arrTemp, ...arrFileItem];

        let ExtImage = props.Extension == Extension.Image;
        console.log("ExtImage", ExtImage);

        if (ExtImage) {
            //ถ้าแนบไฟล์แบบ Image ให้เช็ค Original File ด้วย
            //Check Mime Type
            CheckMimeFileType(arrFileItem);
            setarrFile(arrFileItem);
        }
        else {
            let IsPass = true;
            await Promise.all(arrFileItem.map(async (itemFile, ind) => {
                if (!itemFile.IsCompleted && itemFile.IsNew) {
                    let data = await SendAPIFile(itemFile, ind);
                    itemFile = data
                    setarrMimeType([]);
                    let isCheckCon = ((data.IsCompleted === false && data.sMsg === "") || (data.IsCompleted === false && data.IsProgress === false)) && IsPass === true;
                    if (isCheckCon) {
                        IsPass = false;
                    }
                }
            }));

            //จะเอาแค่ที่อัปโหลดผ่านเท่านั้น
            let dataComplete = arrFileItem.filter((f) => f.IsCompleted === true);
            setarrFile(dataComplete)
        }
    };

    const handleClickDeleteFile = (nFileID, isPopUp) => {

        DialogFn.Submit(i18n.t("msgConfirmDelete"), () => {
            DialogFn.Success(i18n.t('msgDeleteComplete'));
            DialogFn.CloseSubmit();
            DialogFn.UnBlockUI();
            setAnchorEl(null)
            setsrcImage(null)
            // Axios Delete File 
            if (arrFile.length > 0) {
                arrFile.forEach(element => {
                    onDeleteFileInLocation(element.nFile_ID)
                });
                setarrFile([]);
            }
        });
    };

    const onHandleUploadFile = async (e) => {
        setAnchorEl(null)
        let arrTemp = [];       //New array for new file
        let arrNewFile = [] as cFile | any;
        let nSizeFileType = sLimitFile === "GB" ? 1000000000 : 1000000;

        //Check File Size
        for (let i = 0; i < e.target.files.length; i++) {
            if (parseInt((e.target.files[i].size / nSizeFileType).toFixed(1)) > nLimitFile) {
                e.preventDefault();
                DialogFn.SubmitWarning(`ขนาดไฟล์สูงสุดไม่เกิน ${nLimitFile} ${sLimitFile}.`);
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
                console.log("arrExtension", arrExtension);
                console.log("item.sFileType", item.sFileType);
            }
        });
        if (!IsPass) {
            clearNotUploadFile();
            e.preventDefault();
            DialogFn.SubmitWarning(i18n.t("uploadfile.OnlyFile") + sExtension + " !");
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
                        setarrFile(arrTemp);
                        await handleClickFile(arrTemp);
                    }
                }
                else {
                    setarrFile(arrTemp);
                    await handleClickFile(arrTemp);
                }
            }
        }
    }
    //#endregion

    const handleClick = (event) => {
        document.getElementById("profile-image" + keyID).click()
    };

    return (
        <Fragment>
            {props.sTitle &&
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
                    {props.IsRequired && <span style={{ color: "red" }}> *</span>}
                    {props.sSubTitle && <span style={{ fontSize: "13px", color: "#B3B3B3" }}>{props.sSubTitle}</span>}
                </Typography>
            }
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: modeDisplay === "ProfileCircle" ? "bottom" : 'top', horizontal: 'right' }}
                    badgeContent={
                        <IconButton
                            sx={{
                                width: 30,
                                height: 20,
                                borderRadius: '16%'
                                // border: '1px solid #fff'
                            }}
                            disabled={disabled}
                            onClick={(event) => { setAnchorEl(event.currentTarget) }}
                            style={{
                                backgroundColor: '#FBF8F1'
                            }}
                        >
                            <MoreHorizRoundedIcon style={{ color: '#54BAB9' }} />
                        </IconButton>
                    }
                >
                    <input
                        id={"profile-image" + keyID}
                        name={"profile-image" + keyID}
                        multiple={false}
                        type="file"
                        hidden
                        onChange={async (e) => { onHandleUploadFile(e) }}
                        onClick={(e: any) => { e.target.value = ""; }}
                        accept={sAccept}
                    />
                    {
                        (nProgress === 0 || nProgress === 100) ?
                            <div
                                style={{
                                    width: width,
                                    height: height,
                                    objectFit: 'cover',
                                    borderRadius: modeDisplay === "ProfileCircle" ? "50%" : "8px",
                                    margin: '0 auto',
                                    boxShadow: '5px 5px 13px 3px rgb(0 0 0 / 20%)',
                                    cursor: 'pointer',
                                }}
                            >
                                <img
                                    src={srcImage ? srcImage.sCropFileLink : No_BG}
                                    alt=""
                                    style={{
                                        width: width,
                                        height: height,
                                        objectFit: 'cover',
                                        borderRadius: modeDisplay === "ProfileCircle" ? "50%" : "8px",
                                    }}
                                    onError={(e) => { e.currentTarget.src = No_BG }}
                                />
                            </div>
                            :
                            <div
                                style={{
                                    width: width,
                                    height: height,
                                    objectFit: 'cover',
                                    borderRadius: modeDisplay === "ProfileCircle" ? "50%" : "8px",
                                    margin: '0 auto',
                                    boxShadow: '5px 5px 13px 3px rgb(0 0 0 / 20%)',
                                    cursor: 'progress',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <CircularProgressWithLabelProfile value={nProgress} />
                            </div>
                    }
                </Badge>
                <Popover
                    open={Boolean(anchorEl)}
                    onClose={() => { setAnchorEl(null) }}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <MenuItem onClick={handleClick}>
                        <ListItemIcon>
                            <FileUploadRoundedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>UploadFile</ListItemText>
                    </MenuItem>
                    {
                        srcImage && IsCrop &&
                        <MenuItem onClick={() => { setIsopenPopUp(true) }}>
                            <ListItemIcon>
                                <CropRotateRoundedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Edit</ListItemText>
                        </MenuItem>
                    }
                    {
                        srcImage &&
                        <MenuItem onClick={() => { handleClickDeleteFile("", false) }}>
                            <ListItemIcon>
                                <DeleteOutlineRoundedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Delete</ListItemText>
                        </MenuItem>
                    }
                </Popover>
            </div>
            <FilePopup
                file={{
                    sFileType: srcImage ? srcImage.sFileType : "",
                    sFileLink: srcImage ? srcImage.sFileLink : "",
                    sFileName: srcImage ? srcImage.sFileName : "",
                    sCropFileLink: srcImage ? srcImage.sCropFileLink : "",
                    sCropPath: srcImage ? srcImage.sCropPath : "",
                    sUrl: srcImage ? srcImage.sUrl : "",
                    nFile_ID: srcImage ? srcImage.nFile_ID : "",
                }}
                IsopenPopUp={IsopenPopUp}
                ClosePopUp={() => { setIsopenPopUp(false) }}
                SendCropImage={SendCropImage}
                sCropFileLink={srcImage ? srcImage.sCropFileLink : ""}
                IsCrop={IsCrop}
                cropShape={cropShape}
                cropRatio={cropRatio}
                cropResize={cropResize}
                cropMovable={cropMovable}
                nFile_ID={srcImage ? srcImage.nFile_ID : ""}
                isGallery={false}
                arrFile={props.arrFile}
                onDelete={handleClickDeleteFile}
            />
             {
              sPositionText === "bottom" || sPositionText === "right" ?
                <Grid container xs={12} sm={sPositionText === "right" ? 'auto' : 12} sx={{flexDirection:"column",paddingLeft:sPositionText == "right" ? "1rem" : "",paddingTop:sPositionText != "right" ? "1rem" : "" ,justifyContent:sPositionText != "right" ? "" :"center"}}>
                  <Typography variant="caption" sx={{fontSize:"0.9rem"}}>
                    {`${i18n.t("uploadfile.AllowedType")}: ${sExtension} .`}
                  </Typography>
                  {/* <br /> */}
                  <Typography variant="caption" sx={{fontSize:"0.9rem"}}>
                    {`${i18n.t("uploadfile.LimitSize")} ${nLimitFile} ${sLimitFile}`}
                  </Typography>
                  {
                    props.nRecommendWidth && props.nRecommendHeight ?
                      <>
                        {/* <br /> */}
                        <Typography variant="caption" sx={{fontSize:"0.9rem"}}>
                          {`${i18n.t("uploadfile.RecommendedImage")} ${props.nRecommendWidth} x ${props.nRecommendHeight}  px`}
                        </Typography>
                      </>
                      : null
                  }
                  {
                    props.sRemark ?
                      <>
                        <br />
                        <Typography variant="caption" >
                          {props.sRemark}
                        </Typography>
                      </>
                      : null
                  }
                </Grid>
                  :
                  null
            }
        </Fragment>
    );
};
export default ProfileUploadFile;
