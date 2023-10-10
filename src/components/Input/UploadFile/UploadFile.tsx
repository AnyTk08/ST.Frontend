/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useState, useEffect, useCallback, createContext } from "react";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import { Button, FormHelperText, Popover, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from "axios";
import DisplayListRow from "./components/List/DisplayListRow";
import { Extension, IsNullOrUndefined, ParseHtml, FnDialog } from "utilities/ST_Function";
import { AlertTitle } from "config/AlertMsgConfig";
import { AuthToken } from "config/AxiosConfig";
import { SwAlert } from "components/Alert";
import { UploadProps } from "./UploadFileProps";
import DisplayTableFile from "./components/Table/DisplayTableFile";
import DisplayGallery from "./components/Gallery/DisplayGallery";
import ModalError from "./components/PopUp/ModalError";
import "./StyleUploadFile.css";
import { useFormContext } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import InfoIcon from "@mui/icons-material/Info";
import i18n from "config/i18nConfig";
import fileDownload from "js-file-download";

export const ProviderUploadFile = createContext(null);

const UploadFile = (props: UploadProps) => {
	const {
		name,
		nCountLimitFile,
		nLimitFile,
		sLimitFile,
		IsFolder,
		IsMultiDelete,
		sPositionText,
		IsSumSizeAll,
		sPopup,
		IsCrop,
		cropShape,
		cropRatio,
		cropResize,
		cropMovable,
		IsHide = false,
	} = props;

	const {
		register,
		setValue,
		formState: { errors },
	} = useFormContext();

	const DialogFn = FnDialog();

	const [arrFileUpload, setarrFileUpload] = useState(
		props.arrFile as any
	);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [arrExtension, setarrExtension] = useState(
		props.Extension
	);
	const [sExtension, setsExtension] = useState("");
	const [sAccept, setsAccept] = useState("");
	const [IsCompleted, setIsCompleted] = useState(false);
	const [arrMimeType, setarrMimeType] = useState([]);
	const [isOpenError, setisOpenError] = useState(false);
	const [arrMessageError, setarrMessageError] = useState([] as any);
	const [IsopenPopUp, setIsopenPopUp] = useState(false);

	useEffect(() => {
		if (arrFileUpload.length === 0) {
			setValue(name, null);
		} else {
			setValue(name, "Value");
		}
	}, [arrFileUpload]);

	//#region useEffect

	useEffect(() => {
		let arrTemp = [];
		let arrExt = [Extension as any];
		if (arrExtension === null || arrExtension === undefined) {
			let arrExtTemp = [];
			arrExt.forEach((f) => {
				for (let key in f) {
					let i = 0;
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
		} else {
			arrTemp = arrExtension;
			setarrExtension([arrTemp]);
		}
		let sFileType = "",
			sAcceptTemp = "";
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
				handleClickDeleteAllFile();
			};
		}
	}, [props.onClearFile]);

	useEffect(() => {
		let isCheckFile =
			arrMimeType.length > 0 &&
			arrFileUpload.length > 0 &&
			arrMimeType.length === arrFileUpload.length;
		if (isCheckFile) {
			if (arrMimeType.indexOf(false) === -1) {
				arrFileUpload.forEach(async (f, indx) => {
					await SendAPIFile(f, indx);
					setarrMimeType([]);
				});
			} else {
				// Delete file not upload
				clearNotUploadFile();
				setarrMimeType([]);
			}
		}
	}, [arrMimeType]);

	useEffect(() => {
		if (IsCompleted) {
			let newArrFile = arrFileUpload.filter((w) => w.IsCompleted);
			props.setarrFile([...newArrFile]);
		}
	}, [IsCompleted]);

	useEffect(() => {
		if (props.isFileChange) {
			setarrFileUpload(props.arrFile);
		} else {
			if (arrFileUpload.length === 0 && props.arrFile.length > 0) {
				setarrFileUpload(props.arrFile);
			}
		}
	}, [props.arrFile]);

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
							if (check(bytes, mimes[i]))
								return callback(mimes[i].mime);
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
							let isCheckType =
								arrMimeFileType.length > 0 &&
								arrExtension[0].indexOf(arrMimeFileType[1]) >
								-1;
							if (isCheckType) {
								// ถูก Type
								let arrTemp = arrMimeType;
								arrTemp.push(true);
								setarrMimeType([...arrTemp]);
							} else {
								let arrTemp = arrMimeType;
								arrTemp.push(false);
								setarrMimeType([...arrTemp]);
								SwAlert.Warning(
									AlertTitle.Warning,
									`Original file type not include in "${sExtension}" !`,
									() => { }
								);
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
		const auth_token = AuthToken.get() as string;
		const newParam = "UploadFileSevice/CropImageUploadFile";
		const baseUrl = process.env.REACT_APP_API_URL;
		const sPathApi = `${baseUrl}api/${newParam}`;
		const url = new URL(sPathApi, window.location.href);
		const sNewPath = url.origin + url.pathname + url.search;

		await axios({
			url: sNewPath,
			method: "post",
			data: {
				sOldPath: sUrl,
				sBase64: base64,
			},
			headers: {
				"Content-Type": "application/json",
				Authorization: IsNullOrUndefined(auth_token)
					? ""
					: `Bearer ${auth_token}`,
			},
		})
			.then(function (response) {
				setIsopenPopUp(false);
				let nIdexFile = arrFileUpload.findIndex(
					(f) => f.nFile_ID === nFile_ID
				);
				if (nIdexFile > -1) {
					arrFileUpload[nIdexFile].sCropFileLink =
						response.data.sCropFileLink;
					arrFileUpload[nIdexFile].sCropPath =
						response.data.sCropPath;
					setarrFileUpload((e) => [...e]);
				}
			})
			.catch(function (error) {
			});
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
				const auth_token = AuthToken.get() as string;

				const newParam = props.apiPath
					? props.apiPath
					: "UploadFileSevice/UploadFileToTemp";
				const baseUrl = process.env.REACT_APP_API_URL;
				const sPathApi = `${baseUrl}api/${newParam}`;
				const url = new URL(sPathApi, window.location.href);

				const sNewPath = url.origin + url.pathname + url.search;

				await axios({
					url: sNewPath,
					method: "post",
					data: formPayload,
					params: {
						sFolderTemp: props.sFolderTemp ?? "",
						isResize: props.IsResize ?? false, //Image Only
						nWidthResize: props.IsCheckRecommendSize
							? props.nRecommendWidth
							: props.WidthResize,
						nHeigthResize: props.IsCheckRecommendSize
							? props.nRecommendHeight
							: props.HeigthResize,
						nIndex: index,
						IsCheckRecommendSize: props.IsCheckRecommendSize,
					},
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: IsNullOrUndefined(auth_token)
							? ""
							: `Bearer ${auth_token}`,
					},
					onUploadProgress: (progressEvent) => {
						const { loaded, total } = progressEvent;
						const percentageProgress = Math.floor(
							(loaded / total) * 100
						);
						itemFile.sProgress = percentageProgress + "";
						itemFile.IsCompleted = false;
						setIsCompleted(false);
						props.setarrFile((e) => [...e]);
					},
				})
					.then(function (response) {
						DialogFn.UnBlockUI();
						itemFile.sMsg = response.data.sMsg;
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
							itemFile.sDescription = "";
							itemFile.IsNewTab = false;
							itemFile.sPath = response.data.sPath;
							itemFile.sSaveToPath = response.data.sSaveToPath;
							itemFile.sCrop = response.data.sUrl;
							itemFile.sUrl = response.data.sUrl;
							itemFile.nID = response.data.nID;
							setIsCompleted(true);
							props.setarrFile((e) => [...e]);
						} else if (
							(response.data.IsCompleted === true &&
								response.data.sMsg === "") ||
							(!response.data.IsCompleted &&
								response.data.sMsg !== "")
						) {
							let oItemError = {
								...itemFile,
								sFileName: itemFile.sFileName,
								Cause: itemFile.sMsg,
							};
							setarrMessageError((value) => [
								...value,
								...[oItemError],
							]);
						}
					})
					.catch(function (error) {
						console.log("error : ", error);
						setIsCompleted(false);
						itemFile.IsProgress = false;
						itemFile.IsCompleted = false;
						let oItemError = {
							sFileName: itemFile.sFileName,
							Cause: error.message,
						};
						setarrMessageError((value) => [
							...value,
							...[oItemError],
						]);
					});
			} catch (error) {
				console.log("error2 : ", error, itemFile);
				itemFile.IsProgress = false;
				itemFile.IsCompleted = false;
				let oItemError = {
					sFileName: itemFile.sFileName,
					Cause: "Error",
				};
				setarrMessageError((value) => [...value, ...[oItemError]]);
			}
		}
		return itemFile;
	};

	const onDeleteFileInLocation = async (nFile_ID) => {
		// ลบไฟล์ Temp กรณีที่ลบไปก่อนบันทึก
		let oFileID = arrFileUpload.filter((f) => f.nFile_ID === nFile_ID);
		if (oFileID.length > 0) {
			let sPath = oFileID[0].sPath + "/" + oFileID[0].sSysFileName;
			let Param = {
				sPath: sPath,
			};
			const auth_token = AuthToken.get() as string;

			const baseUrl = process.env.REACT_APP_API_URL;
			const sPathApi = `${baseUrl}api/UploadFileSevice/DeleteInTemp`;
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
			});
		}
	};

	const clearNotUploadFile = () => {
		//Delete arrFile
		let arrTemp = arrFileUpload.filter((f) => f.IsCompleted === true);
		setarrFileUpload(arrTemp);
	};

	const onCheckCountFile = (lstFileforAdd = []) => {
		let IsPass = true;
		let arrOld = [...arrFileUpload]
		let nAllFile = arrOld.length + lstFileforAdd.length;
		if (nCountLimitFile && nCountLimitFile < nAllFile) {
			IsPass = false;
		}
		return IsPass;
	}

	const handleClickFile = async (arrFileItem) => {
		let arrTemp = [];
		arrFileUpload.forEach((val) => arrTemp.push(Object.assign({}, val)));
		arrTemp = [...arrTemp, ...arrFileItem];

		let ExtImage = props.Extension === Extension.Image;
		if (ExtImage) {
			//ถ้าแนบไฟล์แบบ Image ให้เช็ค Original File ด้วย
			//Check Mime Type
			CheckMimeFileType(arrFileItem);
			setarrFileUpload(arrFileItem);
		} else {
			let IsPass = true;
			await Promise.all(
				arrFileItem.map(async (itemFile, ind) => {
					if (!itemFile.IsCompleted && itemFile.IsNew) {
						let data = await SendAPIFile(itemFile, ind);
						itemFile = data;
						setarrMimeType([]);
						let isCheckCon =
							((data.IsCompleted === false && data.sMsg !== "") ||
								(data.IsCompleted === false &&
									data.IsProgress === false)) &&
							IsPass === true;

						if (isCheckCon) {
							IsPass = false;
						}
					}
				})
			);

			//จะเอาแค่ที่อัปโหลดผ่านเท่านั้น
			let dataComplete = arrFileItem.filter(
				(f) => f.IsCompleted === true
			);
			setarrFileUpload(dataComplete);
			if (!IsPass) {
				setisOpenError(true);
			}
		}
	};

	const handleClickDeleteFile = (nFile_ID, isPopUp = true) => {
		if (isPopUp) {
			DialogFn.Submit(i18n.t("msgConfirmDelete"), () => {
				DialogFn.Success(i18n.t('msgDeleteComplete'));
				DialogFn.CloseSubmit();
				DialogFn.UnBlockUI();
				let arrNew = arrFileUpload.filter(
					(w) => w.nFile_ID !== nFile_ID
				);
				setarrFileUpload(arrNew);
				// Axios Delete File
				onDeleteFileInLocation(nFile_ID);
				props.setarrFile(arrNew);
			});
		} else {
			let arrNew = arrFileUpload.filter((w) => w.nFile_ID !== nFile_ID);
			setarrFileUpload(arrNew);
			// Axios Delete File
			onDeleteFileInLocation(nFile_ID);
			props.setarrFile(arrNew);
		}
	};

	const handleClickDeleteAllFile = () => {
		setarrFileUpload([]);
		props.setarrFile([]);
	};

	const _addDirectory = (node) => {
		if (node) {
			node.webkitdirectory = true;
			node.directory = true;
		}
	};

	const onHandleUploadFolder = async (e) => {
		setAnchorEl(null);
		setarrMessageError([]);

		let isPassCount = onCheckCountFile(e.target.files)
		if (!isPassCount) {
			//Not pass
			DialogFn.SubmitWarning(
				`อัปโหลดไฟล์ได้ไม่เกิน ${nCountLimitFile} ไฟล์เท่านั้น`
			);
		}
		else {

			let arrTemp = [];
			arrFileUpload.forEach((val) => arrTemp.push(Object.assign({}, val)));
			//Check File Size
			for (const element of e.target.files) {
				let nSizeFile = parseInt(
					(element.size / 1000000).toFixed(1)
				);
				console.log("nSizeFile Folder 1: ", nSizeFile);
				if (nSizeFile > nLimitFile) {
					e.preventDefault();
					DialogFn.SubmitWarning(`${i18n.t("uploadfile.MaximumSize")} ${nLimitFile} ${sLimitFile}.`);
					return false;
				}
			}

			for (let i = 0; i < e.target.files.length; i++) {
				const d = new Date();
				let genID =
					d.getMinutes() + d.getSeconds() + d.getMilliseconds() + "";

				let objFile = e.target.files[i];
				let nSizeFile = parseInt((objFile.size / 1000000).toFixed(1));

				console.log("nSizeFile Folder 2: ", nSizeFile);
				objFile.sFileName = e.target.files[i].name;
				objFile.nFile_ID = i + "_" + genID;
				objFile.IsCompleted = false;
				objFile.IsProgress = true;
				objFile.sSizeName = nSizeFile + "MB";
				objFile.nSizeName = objFile.size;
				objFile.sFolderName =
					objFile.webkitRelativePath !== ""
						? objFile.webkitRelativePath.replace(
							"/" + objFile.sFileName,
							""
						)
						: "";
				objFile.sProgress = "0";
				let arrfilename = (objFile.sFileName + "").split(".");
				objFile.sFileType =
					arrfilename[arrfilename.length - 1].toLowerCase();
				objFile.IsNew = true;
				objFile.sCropFileLink = "";
				objFile.sCropPath = "";
				arrTemp.push(objFile);
			}

			e.target.files = null;

			let IsPass = true;
			arrTemp.forEach((item) => {
				if (arrExtension[0].indexOf(item.sFileType) < 0) {
					IsPass = false;
				}
			});
			if (!IsPass) {
				clearNotUploadFile();
				e.preventDefault();
				DialogFn.Warning(i18n.t("uploadfile.OnlyFile") + sExtension + " !");
			} else {
				setarrFileUpload(arrTemp);
				await handleClickFile(arrTemp);
			}
		}
	};

	const onHandleUploadFile = async (e) => {
		setAnchorEl(null);
		setarrMessageError([]);
		let nSizeFileType = sLimitFile === "GB" ? 1000000000 : 1000000;
		let arrTemp = [];
		let nSizeFileAll = 0;

		let isPassCount = onCheckCountFile(e.target.files)
		if (!isPassCount) {
			//Not pass
			DialogFn.SubmitWarning(
				`อัปโหลดไฟล์ได้ไม่เกิน ${nCountLimitFile} ไฟล์เท่านั้น`
			);
		}
		else {
			//pass
			arrFileUpload.forEach((val) => {
				let size = val.size ?? val.nSizeName; //nSizeName for set new state size hidden
				nSizeFileAll += parseFloat((size / nSizeFileType).toFixed(1));
				arrTemp.push(Object.assign({}, val));
			});

			//Check File Size
			for (const element of e.target.files) {

				let nSizeFile = parseFloat(
					(element.size / nSizeFileType).toFixed(1)
				);
				nSizeFileAll += nSizeFile;
				if (IsSumSizeAll && nSizeFileAll > nLimitFile) {
					e.preventDefault();
					DialogFn.SubmitWarning(
						`${i18n.t(
							"uploadfile.TotalSize"
						)} ${nLimitFile} ${sLimitFile}.`
					);
					return false;
				} else if (nSizeFile > nLimitFile) {
					e.preventDefault();
					DialogFn.SubmitWarning(
						`${i18n.t(
							"uploadfile.MaximumSize"
						)} ${nLimitFile} ${sLimitFile}.`
					);
					return false;
				}
			}
			for (let i = 0; i < e.target.files.length; i++) {
				const dNow = new Date();
				let genID =
					dNow.getMinutes() +
					dNow.getSeconds() +
					dNow.getMilliseconds() +
					"";
				let objFile = e.target.files[i];
				let sSizeFile = (objFile.size / nSizeFileType).toFixed(1);
				objFile.sFileName = e.target.files[i].name;
				objFile.nFile_ID = i + "_" + genID;
				objFile.IsCompleted = false;
				objFile.IsProgress = true;
				objFile.sSizeName = sSizeFile + "MB";
				objFile.nSizeName = objFile.size;
				objFile.sFolderName =
					objFile.webkitRelativePath !== ""
						? objFile.webkitRelativePath.replace(
							"/" + objFile.sFileName,
							""
						)
						: "";
				objFile.sProgress = "0";

				let arrfilename = (objFile.sFileName + "").split(".");
				objFile.sFileType =
					arrfilename[arrfilename.length - 1].toLowerCase();
				objFile.IsNew = true;
				arrTemp.push(objFile);
			}

			e.target.files = null;
			let IsPass = true,
				IsPassName = true,
				IsPassNameOthre = true;

			arrTemp.forEach((item) => {
				if (arrExtension[0].indexOf(item.sFileType) < 0) {
					IsPass = false;
				}
				let arrFileName = item.sFileName.split("_");
				if (!IsNullOrUndefined(props.sFileName)) {
					if (arrFileName.length > 2) {
						if (!IsNullOrUndefined(props.sFileName)) {
							if (
								arrFileName[0].toLowerCase() !==
								props.sFileName.toLowerCase()
							) {
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
				DialogFn.SubmitWarning(
					i18n.t("uploadfile.OnlyFile") + sExtension + " !"
				);
			} else {
				if (!IsPassName && !IsNullOrUndefined(props.sFileName)) {
					clearNotUploadFile();
					e.preventDefault();
					DialogFn.SubmitWarning(
						`Upload file name "` + props.sFileName + `" only.`
					);
				} else {
					if (IsNullOrUndefined(props.sFileName)) {
						if (!IsPassNameOthre) {
							clearNotUploadFile();
							e.preventDefault();
							DialogFn.SubmitWarning(
								`${i18n.t("uploadfile.FilenameSession")}`
							);
						} else {
							setarrFileUpload(arrTemp);
							await handleClickFile(arrTemp);
						}
					} else {
						setarrFileUpload(arrTemp);
						await handleClickFile(arrTemp);
					}
				}
			}
		}


	};

	const handleClick = (event) => {
		if (
			(!props.IsFolder && props.IsMultiple) ||
			(!props.IsFolder && !props.IsMultiple)
		) {
			let DOMfile = document.getElementById(
				"contained-button-file" + props.keyID
			);
			if (DOMfile) {
				DOMfile.click();
			}
		} else if (props.IsFolder && !props.IsMultiple) {
			let DOMfolder = document.getElementById(
				"contained-button-file-folder" + props.keyID
			);
			if (DOMfolder) {
				DOMfolder.click();
			}
		} else {
			setAnchorEl(event.currentTarget);
		}
	};

	//#endregion

	//#region
	const JsxButtonUpload = () => {
		return (
			<Grid
				container
				direction={props.IsDragDrop ? "column" : "row"}
				justifyContent="flex-start"
				alignItems="center"
				style={
					props.IsHiddenUploadBox
						? { display: "none" }
						: {
							paddingTop: "0px",
							textAlign: props.IsDragDrop ? "center" : "left",
						}
				}
			>
				<Grid item xs={12} sm={"auto"} sx={{ paddingRight: "20px" }}>
					<Grid container direction="row" spacing={1} alignItems="center">
						<Grid
							item
							sx={{
								paddingLeft: props.IsDragDrop ? "35% !important" : "",
							}}
						>
							<Button
								aria-controls="customized-menu"
								aria-haspopup="true"
								variant="contained"
								size="small"
								{...register(name)}
								onClick={handleClick}
								startIcon={<CloudUploadIcon />}
								disabled={
									(props.IsMultiple !== true && arrFileUpload.length > 0) ||
									props.disabled
								}
								className="btn-uploadfile"
								title={
									sPositionText === "button"
										? "Allowed file types: " +
										sExtension +
										" File size limits up to " +
										nLimitFile +
										" " +
										sLimitFile
										: ""
								}
							>
								{/* Upload file */}
								อัปโหลดไฟล์
							</Button>
						</Grid>
						{(sPositionText === "bottom" || sPositionText === "right") && (
							<Grid item xs={12} sm={sPositionText === "right" ? "auto" : 12}>
								<Typography variant="caption">
									{`${i18n.t("uploadfile.AllowedType")}: ${sExtension} .`}
								</Typography>
								<br />
								<Typography variant="caption">
									{`${i18n.t(
										"uploadfile.LimitSize"
									)} ${nLimitFile} ${sLimitFile}`}
								</Typography>
								{props.nRecommendWidth && props.nRecommendHeight ? (
									<>
										<br />
										<Typography variant="caption">
											{`${i18n.t("uploadfile.RecommendedImage")} ${props.nRecommendWidth
												} x ${props.nRecommendHeight}  pixels`}
										</Typography>
									</>
								) : null}
								{props.sRemark ? (
									<>
										<br />
										<Typography variant="caption">{props.sRemark}</Typography>
									</>
								) : null}
							</Grid>
						)}

						{sPositionText === "icon" && (
							<Grid item>
								<Tooltip
									title={ParseHtml(
										`${i18n.t(
											"uploadfile.AllowedType"
										)} ${sExtension} <br/>  ${i18n.t(
											"uploadfile.LimitSize"
										)} ${nLimitFile} ${sLimitFile}`
									)}
								>
									<InfoIcon
										style={{
											color: "#000000",
											fontSize: "30px",
										}}
									/>
								</Tooltip>
							</Grid>
						)}
					</Grid>
				</Grid>
			</Grid>
		);
	};
	//#endregion
	//#region  Drop
	const [files, setFiles] = useState([]);
	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			"image/*": [],
		},
		onDrop: (acceptedFiles) => {
			setFiles(
				acceptedFiles.map((file) =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					})
				)
			);
		},
	});

	useEffect(() => {
		// Make sure to revoke the data uris to avoid memory leaks, will run on unmount
		return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
	}, []);

	//#region useCallback Body
	const BodyThumbs = useCallback(() => {
		return (
			<>
				{files.map((file, i) => {
					return (
						<div className="thumb" key={file.name}>
							<div className="thumbInner">
								<img
									src={file.preview}
									alt=""
									className="thumbimg"
									// Revoke data uri after image is loaded
									onLoad={() => {
										URL.revokeObjectURL(file.preview);
									}}
								/>
							</div>
						</div>
					);
				})}
			</>
		);
	}, [files]);
	//#endregion

	//#endregion

	return (
		<Fragment>
			{props.sTitle && (
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
					{props.IsRequired && (
						<span style={{ color: "red" }}> *</span>
					)}
					{props.sSubTitle && (
						<span style={{ fontSize: "13px", color: "#B3B3B3" }}>
							{props.sSubTitle}
						</span>
					)}
				</Typography>
			)}
			{!IsHide && (
				<Grid
					container
					justifyContent="flex-start"
					alignItems="center"
					style={
						props.IsHiddenUploadBox
							? { display: "none" }
							: { paddingTop: "0px" }
					}
				>
					{props.IsDragDrop ? (
						<Grid item xs={12}>
							{/* <Dropzone 
                multiple={props.IsMultiple} 
                disabled={(props.IsMultiple !== true && arrFileUpload.length > 0) || props.disabled} 
                onDrop={onDrop}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className="drag-drop-container">
                    <div
                      {...getRootProps({
                        className: 'dropzone',
                      })}
                    >
                      <input {...getInputProps()} />
                      <p className="s-paragraph">Drag and drop files here, or click to upload file</p>
                    </div>
                    <p className="s-paragraph">or</p>
                    <div>
                      {JsxButtonUpload()}
                    </div>
                  </div>
                )}
              </Dropzone> */}

							<div className="drag-drop-container">
								<div
									{...getRootProps({ className: "dropzone" })}
								>
									<input {...getInputProps()} />
									<p className="s-paragraph">
										Drag and drop files here, or click to
										upload file
									</p>
								</div>
								<p className="s-paragraph">or</p>
								<div>{JsxButtonUpload()}</div>
								<div className="thumbsContainer">
									<BodyThumbs />
								</div>
							</div>
						</Grid>
					) : (
						<Grid item xs={12}>
							{JsxButtonUpload()}
						</Grid>
					)}
				</Grid>
			)}
			{errors?.name && arrFileUpload.length === 0 ? (
				<FormHelperText sx={{ color: "red" }}>
					{String(errors[name].message)}
				</FormHelperText>
			) : null}
			<ProviderUploadFile.Provider
				value={{
					IsAddDescription: props.IsAddDescription,

				}}
			>
				<Grid container spacing={2}>
					{props.modeDisplay === "table" && arrFileUpload.length > 0 &&
						<Grid item xs={12} style={{ marginTop: "8px" }}>
							<DisplayTableFile
								arrFile={arrFileUpload}
								setarrFile={setarrFileUpload}
								onDelete={handleClickDeleteFile}
								disabled={props.disabled}
								onOpenFile={props.onOpenFile}
								IsCrop={IsCrop}
								cropShape={cropShape}
								cropRatio={cropRatio}
								cropResize={cropResize}
								cropMovable={cropMovable}
								IsHiddenUploadBox={props.IsHiddenUploadBox}
								setStartVideoOn={props.setStartVideoOn}
								nStartVideoOn={props.nStartVideoOn}
								CannotSkipForward={props.CannotSkipForward}
								onVideoEnd={props.onVideoEnd}
								nRowperpageTable={props.nRowperpageTable}
								SendCropImage={SendCropImage}
								IsopenPopUp={IsopenPopUp}
								setIsopenPopUp={setIsopenPopUp}
								onDeleteFileInLocation={onDeleteFileInLocation}
								IsMultiDelete={IsMultiDelete}
								sPopup={sPopup}
							/>
						</Grid>
					}

					{props.modeDisplay === "gallery" && arrFileUpload.length > 0 &&
						<Grid item xs={12} style={{ marginTop: "8px" }}>
							<DisplayGallery
								arrFile={arrFileUpload}
								onDelete={handleClickDeleteFile}
								disabled={props.disabled}
								onOpenFile={props.onOpenFile}
								IsCrop={IsCrop}
								cropShape={cropShape}
								cropRatio={cropRatio}
								cropResize={cropResize}
								cropMovable={cropMovable}
								IsHiddenUploadBox={props.IsHiddenUploadBox}
								setStartVideoOn={props.setStartVideoOn}
								nStartVideoOn={props.nStartVideoOn}
								CannotSkipForward={props.CannotSkipForward}
								onVideoEnd={props.onVideoEnd}
								IsopenPopUp={IsopenPopUp}
								setIsopenPopUp={setIsopenPopUp}
								SendCropImage={SendCropImage}
								IsMultiDelete={IsMultiDelete}
								sPopup={sPopup}
							/>
						</Grid>
					}
					{props.modeDisplay === "list" && arrFileUpload.length > 0 &&
						<Grid item xs={12}>
							<DisplayListRow
								arrFile={arrFileUpload}
								SetarrFile={setarrFileUpload}
								onDelete={handleClickDeleteFile}
								IsCanDel={props.IsCanDel ? props.IsCanDel : true}
								IsDrag={props.IsDrag || false}
								disabled={props.disabled}
								onOpenFile={props.onOpenFile}
								IsCrop={IsCrop}
								cropShape={cropShape}
								cropRatio={cropRatio}
								cropResize={cropResize}
								cropMovable={cropMovable}
								IsHiddenUploadBox={props.IsHiddenUploadBox}
								setStartVideoOn={props.setStartVideoOn}
								nStartVideoOn={props.nStartVideoOn}
								CannotSkipForward={props.CannotSkipForward}
								onVideoEnd={props.onVideoEnd}
								IsopenPopUp={IsopenPopUp}
								SendCropImage={SendCropImage}
								setIsopenPopUp={setIsopenPopUp}
								onDeleteFileInLocation={onDeleteFileInLocation}
								IsMultiDelete={IsMultiDelete}
								sPopup={sPopup}
								IsHide={IsHide}
							/>
						</Grid>
					}
				</Grid>
			</ProviderUploadFile.Provider>

			<Popover
				open={Boolean(anchorEl)}
				onClose={() => {
					setAnchorEl(null);
				}}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
			>
				{IsFolder ? (
					<MenuItem style={{ padding: " 8px 16px" }}>
						<label
							htmlFor={
								"contained-button-file-folder" + props.keyID ||
								""
							}
							style={{
								width: "100%",
								display: "contents",
								cursor: "pointer",
							}}
						>
							<ListItemIcon style={{ cursor: "pointer" }}>
								<DriveFolderUploadIcon
									className={"mui-style-IConColor"}
								/>
							</ListItemIcon>
							<ListItemText
								primary="Folder Upload"
								style={{ cursor: "pointer" }}
							/>
						</label>
					</MenuItem>
				) : null}
				{props.IsMultiple ||
					(props.IsMultiple !== true && arrFileUpload.length === 0) ? (
					<MenuItem style={{ padding: " 8px 16px" }}>
						<label
							htmlFor={
								"contained-button-file" + props.keyID || ""
							}
							style={{
								width: "100%",
								display: "contents",
								cursor: "pointer",
							}}
						>
							<ListItemIcon style={{ cursor: "pointer" }}>
								<UploadFileIcon className={"mui-style-IConColor"} />
							</ListItemIcon>
							<ListItemText
								primary="File Upload"
								style={{ cursor: "pointer" }}
							/>
						</label>
					</MenuItem>
				) : null}
			</Popover>
			<input
				id={"contained-button-file-folder" + props.keyID || ""}
				name={"contained-button-file-folder" + props.keyID || ""}
				onChange={async (e) => {
					onHandleUploadFolder(e);
				}}
				onClick={(e: any) => {
					e.target.value = "";
				}}
				ref={(node) => _addDirectory(node)}
				multiple
				type="file"
				hidden
				accept={sAccept}
			/>
			<input
				id={"contained-button-file" + props.keyID}
				name={"contained-button-file" + props.keyID}
				multiple={props.IsMultiple}
				type="file"
				hidden
				onChange={async (e) => {
					onHandleUploadFile(e);
				}}
				onClick={(e: any) => {
					e.target.value = "";
				}}
				accept={sAccept}
			/>
			<ModalError
				open={isOpenError}
				setOpen={setisOpenError}
				arrDataError={arrMessageError}
				// handleClickReload={handleClickReload}
				nRowperpageTable={props.nRowperpageTable}
			/>
		</Fragment>
	);
};
export default UploadFile;

export const downloadFile = (url: string, filename: string) => {
	axios.get(url, {
		responseType: 'blob',
	}).then(res => {
		fileDownload(res.data, filename);
	});
}
