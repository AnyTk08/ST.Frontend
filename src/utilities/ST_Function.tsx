import Crypto from "crypto-js";
import { keyCrypto } from 'config/AppConfig'
import parse from 'html-react-parser';
import Moment from 'moment';
import { useDispatch } from "react-redux";
import BlockUIActionCreators from "store/redux/BlockUI";
import { DialogActionCreators } from "store/redux/DialogAlert";
import secureLocalStorage from "react-secure-storage";
import { GridColumns } from "@mui/x-data-grid-pro";
import Tooltip from "@mui/material/Tooltip";
import { EnumStatus } from "../components/enum/enumSystem"

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
const JWT = process.env.REACT_APP_JWT_KEY;

//#region Function
export const IsNullOrUndefined = (Value: any) => {
    let Result = true;
    if (Value) {
        Result = false;
    }
    return Result;
};

export const IsEmpty = (value) => {
    if (value === null || value === undefined || value === "") return true;
    else return false;
}
export const undefinedOrNull = (value, mode?: "string" | "number" | "bool" | "dateToString", format = "DD/MM/YYYY") => {
    if (mode == "string") {
        return value != undefined ? value + "" : "";
    }
    else if (mode == "number") {
        return value != undefined && value != "" ? (+value) : null;
    } else if (mode == "bool") {
        let res = false;
        if (value != undefined && value != "") {
            if ((value + "").toLowerCase() == "true") {
                res = true;
            }
        }
        return res;
    } else if (mode == "dateToString") {
        let res = null;
        if (value != undefined && value != null && value != "") {

            res = DateTimeToString(value, format);
        }
        return res;
    }
    else {
        return value != undefined ? value : null;
    }
}

export const ToInt = (Value: string) => {
    let Result = 0;
    if (Value) {
        Result = parseInt(Value);
    }
    return Result;
};

/**
 * แปลง string เป็น html
 * @param val 
 * @returns Tag html
 */
export const ParseHtml = (val: string) => {
    if (val)
        return parse(val);
    else
        return val;
}
/**
 * แปรง Date เป็น String
 * @param value string
 * @param format string
 * @returns Date string
 */
export const DateTimeToString = (value, format = "DD/MM/YYYY") => {
    Moment.locale('en');
    let result = null;

    if (Moment(value).isValid()) {
        result = Moment(value).format(format);
    }
    return result;
};

/**
 * แปรง String เป็น Date
 * @param value string "YYYY-MM-DD"
 * @returns DateTime string
 */
export const StringToDateTime = (value) => {
    Moment.locale('en');
    let result = null;
    let date = Moment(value);

    if (date.isValid()) {
        result = date;
    }
    return result;
};

export const AddCommas = (nStr) => {
    nStr += "";
    let x = nStr.split(".");
    let x1 = x[0];
    let x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
};

export const ParseFloatToZero = (sVal) => {
    sVal = (sVal + "").replace(/,/g, "");
    return !isNaN(parseFloat(sVal)) ? parseFloat(sVal) : 0;
};

export const ParseFloatToNull = (sVal) => {
    sVal = (sVal + "").replace(/,/g, "");
    return !isNaN(parseFloat(sVal)) ? parseFloat(sVal) : null;
};

export const ParseNumberToNull = (sVal) => {
    sVal = (sVal + "").replace(/,/g, "");
    return !isNaN(Number(sVal)) ? Number(sVal) : null;
};

export const ParseNumberToZero = (sVal) => {
    sVal = (sVal + "").replace(/,/g, "");
    return !isNaN(Number(sVal)) ? Number(sVal) : 0;
};

export const ValidatePhoneNumber = (IsTel = true) => {
    var phoneRe = /((\+66|0)(\d{2}-?\d{3}-?\d{4}))/gm;
    if (!IsTel) {
        phoneRe = /((\+66|0)(\d{1}-?\d{3}-?\d{4,5}))/gm;
    }
    return phoneRe;
};

export const CheckIDCard = (idcard) => {
    if (IsEmpty(idcard)) {
      return false;
    }
    if (idcard.length < 13) {
      return false;
    }
  
    var num = str_split(idcard, idcard.length)[0]; // function เพิ่มเติม
    var sum = 0;
    var total = 0;
    var digi = 13;
  
    for (var i = 0; i < 12; i++) {
      sum = sum + ParseNumberToZero(num[i]) * digi;
      digi--;
    }
    total = (11 - (sum % 11)) % 10;
  
    if (total == num[12]) {
      return true;
    } else {
      return false;
    }
};

const str_split = (f_string, f_split_length) => {
    f_string += "";
    if (f_split_length == undefined) {
        f_split_length = 1;
    }
    if (f_split_length > 0) {
        var result = [] as Array<string>;
        while (f_string.length > f_split_length) {
            result[result.length] = f_string.substring(0, f_split_length);
            f_string = f_string.substring(f_split_length);
        }
        result[result.length] = f_string;
        return result;
    }
    return false;
};

//#endregion

//#region Crypto
export const Encrypt = (dataEncrypt: any) => {
    let data = dataEncrypt.toString();
    let result = Crypto.AES.encrypt(data, keyCrypto).toString();
    result = result.replace(/\//g, "s14sh").replace(/\+/g, "p1u5");

    return result;
};
export const Decrypt = (dataDecrypt: any) => {
    if (dataDecrypt && dataDecrypt != null && dataDecrypt != "null") {
        dataDecrypt = dataDecrypt.replace(/s14sh/g, "/").replace(/p1u5/g, "+");
        let bytes = Crypto.AES.decrypt(dataDecrypt, keyCrypto);
        let result = bytes.toString(Crypto.enc.Utf8);
        return result;
    } else {
        return "";
    }
};
export const OpenNewTab = (sUrl) => {
    let newWindow = window.open(sUrl, "_blank", 'noopener,noreferrer')
    if(newWindow)
    {
      newWindow.opener = null;
    }
};

//#endregion

//#region Extension Type For Upload file

export const Extension = {
    Image: ["jpg", "jpeg", "png", "gif"],
    ImageExport: ["jpg", "jpeg", "png"],
    //Video: ["mov", "wmv", "avi", "mp4"],
    Video: ["mp4"],
    PDF: ["pdf"],
    Document: ["doc", "docx", "xls", "xlsx"],
    Word: ["doc", "docx"],
    Excel: ["xls", "xlsx"],
    PowerPoint: ["pptx", "pdf", "ppt"],
    Email: ["msg"],
    Other: ["rar", "zip"],
    ImagePDF: ["jpg", "jpeg", "png", "gif", "pdf"],
    ImageDocument: [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "pptx",
      "ppt",
      "pdf",
    ],
    AllType: null,
  };
//#endregion

export const FnDialog = () => {
    const Dispatch = useDispatch() as any;
    const BlockUI = () => Dispatch(BlockUIActionCreators.BlockUI());
    const UnBlockUI = () => Dispatch(BlockUIActionCreators.UnBlockUI());

    const Success = (msg?) =>
        Dispatch(DialogActionCreators.OpenDialogSuccess(msg));
    const Warning = (msg?) =>
        Dispatch(DialogActionCreators.OpenDialogWarning(msg));
    const Errormsg = (msg?) => Dispatch(DialogActionCreators.OpenDialogError(msg));

    const Submit = (msg, fn?) => {
        Dispatch(DialogActionCreators.CloseDialogSuccess());
        Dispatch(DialogActionCreators.CloseDialogError());
        Dispatch(DialogActionCreators.CloseDialogWarning());
        return Dispatch(DialogActionCreators.OpenDialogSubmit(msg, fn));
    }
    const SubmitWarning = (msg, fn?, fnC?) => {
        Dispatch(DialogActionCreators.CloseDialogSuccess());
        Dispatch(DialogActionCreators.CloseDialogError());
        Dispatch(DialogActionCreators.CloseDialogWarning());
        return Dispatch(DialogActionCreators.OpenDialogSubmitWarning(msg, fn, fnC));
    }
    const CloseSubmit = () => Dispatch(DialogActionCreators.CloseDialogSubmit());
    const CloseSubmitWarning = () =>
        Dispatch(DialogActionCreators.CloseDialogSubmitWarning());

    return {
        Success,
        Warning,
        Errormsg,
        Submit,
        SubmitWarning,
        CloseSubmit,
        CloseSubmitWarning,
        BlockUI,
        UnBlockUI,
    };
};

export const onLoginComplete = (objData) => {
    secureLocalStorage.setItem(JWT, objData.token);

    FirstForgery();
};

export const FirstForgery = () => {
    let txtFirstForgery = document.getElementById("txtFirstForgery") as HTMLInputElement;
    let btn = document.getElementById("btnAntifogery") as HTMLButtonElement;
    if (btn && txtFirstForgery) {
        if (txtFirstForgery.value != "Y") {
            btn.click();
        }
    }
};

export const OnFocus = (CtrlID1: string, CtrlID2: string) => {
    let CTRL1 = document.getElementById(CtrlID1);
    let CTRL2 = document.getElementById(CtrlID2);
    if (CTRL1) {
        CTRL1.addEventListener("keydown", function (e) {
            if (e.keyCode === 13) {
                if (CTRL2) {
                    CTRL2.click();
                    return false;
                }
            } else if (e.keyCode === 220) return false; //keyCode - BACKSLASH : 220
        });
    }
};

export const DynamicLangCol = (lstData, dataCol ,indexMap) => {
    let arrCol: GridColumns = dataCol;
    let arrNewCol = [];
    lstData.forEach((item, index) => {
      let objColAdd = {
        field: `sLanguageName${item.label}`,
        headerName: item.label,
        headerAlign: "center",
        align: "center",
        width: 70,
        sortable: false,
        renderCell: (p) => {
          let status = p.row.lstLanguageCode.find(
            (f) => f.label === item.label
          ).value;
          return [
            status === EnumStatus.Submit.toString() && (
              <Tooltip title="Complete">
                <CheckCircleIcon
                  sx={{
                    fontSize: "1.5rem",
                    color: "rgb(45, 206, 137)",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            ),
            status === EnumStatus.Draft.toString() && (
              <Tooltip title="draft">
                <HourglassBottomIcon
                  sx={{
                    fontSize: "1.5rem",
                    color: "rgb(223, 173, 21)",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            ),
          ];
        },
      };
      arrNewCol = insert(arrCol, indexMap + index, objColAdd);
      arrCol = arrNewCol;
    });
    return arrCol;
  };

  export const insert = (arr, index, newItem) => [
    ...arr.slice(0, index),
    newItem,
    ...arr.slice(index),
  ];

  export function formatNumber(num: any, digit: number) {
    if (num != null && num !== "N/A" && num !== "") {
        return parseFloat(num).toFixed(digit).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    else {
        return num
    }
}


  