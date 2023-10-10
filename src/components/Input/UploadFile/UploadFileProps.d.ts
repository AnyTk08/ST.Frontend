export interface cFile {
  nFile_ID: number;
  webkitRelativePath: string;
  sMsg: string;
  sFolderName: string;
  sFileName: string;
  name: string;
  sSysFileName: string;
  sDescription: string;
  nFileType_ID: number;
  size: number;
  nSize: number;
  sSizeName: string;
  type: string;
  dUploadBy: number;
  dUploadDate: Date;
  sFileLink: string;
  sPath: string;
  sCropFileLink: string;
  sCropPath: string;
  IsCompleted: boolean;
  IsProgress: boolean;
  lastModified: Date;
  lastModifiedDate: Date;
  IsNew: boolean;
  IsNewTab: boolean;
}

export interface UploadProps {
  IsRequired: boolean;
  modeDisplay?:
    | "list"
    | "table"
    | "gallery"
  id: string;
  name: string;
  keyID: any;
  sTitle?: string;
  sSubTitle?: string;
  IsCheckRecommendSize?: boolean;
  nRecommendWidth?: number,   //https://tiny-img.com/blog/best-image-size-for-website/
  nRecommendHeight?: number, 
  sRemark?: string;
  arrFile: any[];
  setarrFile: any;
  Extension: any;
  nCountLimitFile?: number,
  nLimitFile: number;
  sLimitFile: "MB" | "GB";
  IsFolder: boolean;
  onClearFile: any; //UseRef for Clear File
  isFileChange?: boolean;
  IsMultiple: boolean;
  IsHiddenUploadBox?: boolean;
  disabled?: boolean;
  IsCanDel?: boolean;
  IsDrag?: boolean;
  IsAddDescription?: boolean;
  dataID?: string;
  apiPath?: string;
  sFileName?: string;
  sFolderTemp?: string;
  //For video
  onOpenFile?: any;
  setStartVideoOn?: any;
  nStartVideoOn?: any;
  setarrFile?: any;
  CannotSkipForward?: any;
  onVideoEnd?: any;
  //For Resize Image Only
  IsResize?: boolean;
  WidthResize?: number;
  HeigthResize?: number;
  //Reload For Upload Fail
  IsDragDrop?: boolean;
  nRowperpageTable?: number;
  IsShowIcon?: boolean;
  IsMultiDelete?: boolean;
  sPositionText?: "bottom" | "button" | "right" | "icon";
  IsSumSizeAll?: boolean;
  sPopup?: "fullscreen" | "newtab" | "modal"; 

  IsCrop?: boolean;
  cropShape?: "retangle" | "circle";
  cropRatio?: number;
  cropResize?: boolean;
  cropMovable?: boolean;
  IsHide?: boolean;
}

export interface DynamicUploadProps {
  IsRequired: boolean,
  id: string,
  name: string,
  keyID: any,
  sTitle?: string,
  sSubTitle?: string,
  sRemark?: string,
  arrFile: any,
  Extension: any,
  nLimitFile?: number,
  sLimitFile?: "MB" | "GB",
  IsFolder: boolean,
  IsFile: boolean,
  // onClearFile: any,   //UseRef for Clear File
  isFileChange?: boolean,
  IsMultiple: boolean,
  IsHiddenUploadBox?: boolean,
  disabled?: boolean,
  IsCanDel?: boolean,
  IsDrag?: boolean,
  dataID?: string,
  apiPath?: string,
  sFileName?: string,
  sFolderTemp?: string,
  //For Resize Image Only
  IsResize?: boolean,
  WidthResize?: number,
  HeigthResize?: number,
  //Reload For Upload Fail
  IsReload: boolean,
}

export interface ProfileUploadProps {
  IsRequired: boolean,
  modeDisplay?: "ProfileCircle" | "ProfileRectangle";
  id: string,
  keyID: any,
  width: any,
  height: any,
  sTitle?: string,
  sSubTitle?: string,
  sRemark?: string,
  arrFile: any[],
  setarrFile: any,
  Extension: any,
  nLimitFile: number,
  sLimitFile: "MB" | "GB",
  onClearFile: any,   //UseRef for Clear File
  IsHiddenUploadBox?: boolean,
  disabled?: boolean,
  IsCanDel?: boolean,
  dataID?: string,
  apiPath?: string,
  sFileName?: string,
  sFolderTemp?: string,
  //Reload For Upload Fail
  IsDragDrop?: boolean,
  IsCrop: boolean,
  cropShape?: "retangle" | "circle";
  cropRatio?: number;
  cropResize?: boolean;
  cropMovable?: boolean;
  sPositionText?: "bottom" | "button" | "right";
  nRecommendWidth?: number;   //https://tiny-img.com/blog/best-image-size-for-website/
  nRecommendHeight?: number;
}