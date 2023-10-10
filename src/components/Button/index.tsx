import React from "react";
import { Button, Fab, IconButton, Theme, Tooltip } from "@mui/material";
import {
  Search,
  ArrowBackIos,
  DeleteForever,
  Add,
  Info,
  Cancel,
  Summarize,
  CloseRounded,
  Home,
  SaveAlt,
  RefreshRounded,
  RemoveRedEye,
  Image,
  Edit,
  Link,
  Delete,
  Print,
  Clear,
  Visibility,
  Undo,
  Save,
  TaskAltRounded,
  UploadFile,
  DoneAll,
  List,
} from "@mui/icons-material";
import { TemplateColor } from "components";
import { styled } from '@mui/material/styles';
import { BtnProp, ButtonCustomProp } from "./Button";
import { MdRecycling } from "react-icons/md";
import { HiOutlineSave } from "react-icons/hi";
import { BiEdit } from "react-icons/bi";
import { BsFileEarmarkExcel } from "react-icons/bs";
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { GridActionsCellItem } from "@mui/x-data-grid-pro";
import { ParseHtml } from "utilities/ST_Function";
import DescriptionIcon from '@mui/icons-material/Description';
import { blue } from "@mui/material/colors";
import DehazeIcon from '@mui/icons-material/Dehaze';
import MenuIcon from '@mui/icons-material/Menu';
import excelIcon from "./../../assets/images/Icon/excelIcon.png";
import pdfIcon from "./../../assets/images/Icon/pdfIcon.png";


const sizeDefault = { width: 40, height: 40, heightText: "40px", widthText: "40px" };
const styleX = {
  btnCircle: {
    padding: "8px",
    // my: 2,
    // border: "1px solid #f2f2f2",
    // borderRadius: "50%",
    // height: sizeDefault.heightText,
    // ".MuiFilledInput-input": { paddingTop: "10px" },
  },
  btnRadius: {
    my: 2,
    border: "1px solid #f2f2f2",
    borderRadius: "20px",
    height: sizeDefault.heightText,
    ".MuiFilledInput-input": { paddingTop: "10px" },
  },
  btnRadiusProfile: {
    my: 2,
    // border: "1px solid #f2f2f2",
    borderRadius: "20px",
    height: sizeDefault.heightText,
    width: "50%",
    ".MuiFilledInput-input": { paddingTop: "10px" },
  },
  btnPrimaryColor: {
    color: "white",
    // padding: "0.5em 2em",
    borderRadius: "2em",
    backgroundColor: TemplateColor.ColorPrimary,
    ":hover": {
      backgroundColor: TemplateColor.ColorPrimaryHover,
    },
    width: "max-content",
  },
  btnSubmit: {
    color: "white",
    backgroundColor: "#31409c",
    ":hover": {
      backgroundColor: "#5a66af",
    },
    borderRadius: "20px",

  },
  btnCancel: {
    color: "white",
    backgroundColor: "#ed3847",
    ":hover": {
      backgroundColor: "rgb(220, 53, 69)",
    },
    borderRadius: "20px"
  },
  btnBack: {
    backgroundColor: "#a7a7a7",
    ":hover": {
      backgroundColor: "#878787",
    },
    borderRadius: "20px",
  },
  btnPreview: {
    backgroundColor: "#e39a2d",
    ":hover": {
      backgroundColor: "#b9812d",
    },
  },
  btnBooking: {
    backgroundColor: "#3aba18",  //#f5945c
    ":hover": {
      backgroundColor: "#39a21d",
    },
    borderRadius: "20px",
  },
  btnCreateBook: {
    backgroundColor: "#f1a43f",  //#f5945c
    ":hover": {
      backgroundColor: "#e0932d",
    },
    borderRadius: "20px",
  },
  btnDelete: {
    backgroundColor: "#d00000",
    ":hover": {
      backgroundColor: "#9d0208",
    },
    borderRadius: "20px",
  },
  btnAdd: {
    backgroundColor: "#0096c7",
    ":hover": {
      backgroundColor: "#0077b6",
    },
    borderRadius: "20px",
  },
  btnSave: {
    backgroundColor: "#70e000",
    ":hover": {
      backgroundColor: "#38b000",
    },
    borderRadius: "20px",
  },
  btnNote: {
    backgroundColor: "#0096c7",
    ":hover": {
      backgroundColor: "#0077b6",
    },
    borderRadius: "20px",
  },
  btnReject: {
    backgroundColor: "#d00000",
    ":hover": {
      backgroundColor: "#9d0208",
    },
    borderRadius: "20px",
  },
};

const BaseButton = styled(Button)(({ theme }) => ({
  boxShadow: 'none',
  textTransform: 'none',
  // fontSize: 16,
  border: '1px solid',
  lineHeight: 1.5,
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  [theme.breakpoints.down('sm')]: {
    width: "40px",
    minWidth: "40px",
    height: "40px",
    fontSize: "0px",
    lineHeight: "0px",
    "& .MuiButton-startIcon": { margin: 0 }

  },
}));

const FullBaseButton = styled(Button)(({ theme }) => ({
  boxShadow: 'none',
  textTransform: 'none',
  // fontSize: 16,
  border: '1px solid',
  lineHeight: 1.5,
  backgroundColor: '#3dcc00',
  borderColor: '#3dcc00',
}));

const adjustedButtonProps = (disabled, onClick) => {
  return {
    disabled: disabled,
    component: disabled ? "div" : undefined,
    onClick: disabled ? undefined : onClick
  }
};

export const BtnConfirmSearch = ({
  IsDisabled = false,
  IsHidden = false,
  onClick = () => { },
  txt = "Search",
  isCircleWithOutText = false,
  tooltipPlacement = "bottom",
  id
}) => {
  return (IsHidden ?
    (
      null
    )
    :
    (
      <Tooltip placement={tooltipPlacement as any} title={txt}>
        {!isCircleWithOutText ?
          (
            <Button
              id={id}
              variant="contained"
              size="medium"
              startIcon={<Search />}
              disabled={IsDisabled}
              onClick={onClick}
              sx={styleX.btnPrimaryColor}
              {...adjustedButtonProps(IsDisabled, onClick)}
            >
              {txt}
            </Button>
          )
          :
          (
            <Fab
              id={id}
              sx={[styleX.btnPrimaryColor, { ...sizeDefault }]}
              onClick={onClick}
              aria-label="search"
            >
              <Search />
            </Fab>
          )
        }
      </Tooltip>
    )
  );
};

export const BtnClearFilter = ({
  IsDisabled = false,
  IsHidden = false,
  onClick = () => { },
  txt = "Clear",
  isCircleWithOutText = false,
  tooltipPlacement = "bottom",
  id
}) => {
  return (IsHidden ?
    (
      null
    )
    :
    (
      <Tooltip placement={tooltipPlacement as any} title={txt}>
        {!isCircleWithOutText ? (
          <Button
            id={id}
            variant="contained"
            size="medium"
            startIcon={<RefreshRounded />}
            disabled={IsDisabled}
            onClick={onClick}
            sx={styleX.btnBack}
            {...adjustedButtonProps(IsDisabled, onClick)}
          >
            {txt}
          </Button>
        ) : (
          <Fab
            id={id}
            onClick={onClick}
            sx={{ width: 40, height: 40, color: "#a6a6a6" }}
            aria-label="back"
          >
            <RefreshRounded />
          </Fab>
        )}
      </Tooltip>
    )
  );
};

export const BtnCustomIcon = ({
  IsDisabled = false,
  IsHidden = false,
  onClick = (e?) => { },
  txt = "",
  isCircleWithOutText = false,
  sIconComponent = null,
  eIconComponent = null,
  sx = {},
  tooltipPlacement = "bottom",
  id
}) => {
  return (IsHidden ?
    (
      null
    )
    :
    (
      <Tooltip placement={tooltipPlacement as any} title={txt}>
        {!isCircleWithOutText ? (
          <Button
            id={id}
            variant="contained"
            size="small"
            startIcon={sIconComponent ? sIconComponent : null}
            endIcon={eIconComponent ? eIconComponent : null}
            sx={[styleX.btnBack, { ...sx }]}
            {...adjustedButtonProps(IsDisabled, onClick)}
          >
            {txt}
          </Button>

        ) : (
          <Fab
            id={id}
            sx={[styleX.btnBack, { ...sizeDefault, ...sx }]}
            onClick={onClick}
            disabled={IsDisabled}
          >
            {sIconComponent ? sIconComponent : null}
          </Fab>
        )}
      </Tooltip>
    )
  );
};

// ********************************************************************************************อันใหม่ อันบนอันเก่าจะลบ

export const BtnBaseButton = (props: ButtonCustomProp) => {

  const {
    id,
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    startIcon,
    txt = "ต้นแบบ",
    isCircleWithOutText = false,
    tooltipPlacement = "bottom",
    size = "medium",
    fontColor = "#fff",
    bgcolor = "tranparent",
    bgcolorHover = "tranparent",
    isRadius = true,
    isFullwidth = false,
    className = "",
    sx,
  } = props;

  return (
    <Tooltip placement={tooltipPlacement} title={ParseHtml(txt)}>
      { isFullwidth ?
      (
        <FullBaseButton
          variant="contained"
          id={id}
          size={size}
          startIcon={startIcon}
          disabled={isDisabled}
          className={className}
          fullWidth
          hidden={isHidden}
          onClick={onClick}
          sx={(theme: Theme) => ({
            ...sx,
            color: fontColor,
            backgroundColor: bgcolor,
            borderColor: bgcolor,
            borderRadius: isRadius ? "20px" : "8px",
            ":hover": {
              bgcolor: bgcolorHover,
              borderColor: bgcolorHover
            },
            ".Mui-disabled": {
              color: 'rgba(0, 0, 0, 0.26)',
              boxShadow: 'none',
              // backgroundColor: 'rgba(0, 0, 0, 0.12)',
              borderColor: 'rgba(0, 0, 0, 0.12)'
            }
          })}
        >
          {txt}
        </FullBaseButton>
      )
      :
      (
        !isCircleWithOutText ?
        (
          <BaseButton
            variant="contained"
            id={id}
            size={size}
            startIcon={startIcon}
            disabled={isDisabled}
            className={className}
            // fullWidth
            hidden={isHidden}
            onClick={onClick}
            sx={() => ({
              ...sx,
              color: fontColor,
              backgroundColor: bgcolor,
              borderColor: bgcolor,
              borderRadius: isRadius ? "20px" : "8px",
              ":hover": {
                bgcolor: bgcolorHover,
                borderColor: bgcolorHover
              },
              ".Mui-disabled": {
                color: 'rgba(0, 0, 0, 0.26)',
                boxShadow: 'none',
                // backgroundColor: 'rgba(0, 0, 0, 0.12)',
                borderColor: 'rgba(0, 0, 0, 0.12)'
              }
            })}

          >
            {txt}
          </BaseButton>
        )
        :
        (
          <Fab
            id={id}
            className={className}
            onClick={onClick}
            sx={{
              ...sx,
              width: 40,
              height: 40,
              color: fontColor,
              backgroundColor: bgcolor,
              borderColor: bgcolor,
              ":hover": {
                bgcolor: bgcolorHover,
                borderColor: bgcolorHover
              },
              ".MuiSvgIcon-root": {
                color: '#ffffff !important'
              }
            }}
          >
            {startIcon}
          </Fab>
        )
      )
      } 
    </Tooltip>
  );
};

export const BtnSave = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "บันทึก",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<Save />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#33a64c"
      bgcolorHover="#33a64c"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

export const BtnApprove = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "Approve",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<TaskAltRounded />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#33a64c"
      bgcolorHover="#33a64c"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

export const BtnConfirm = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "ยืนยัน",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<TaskAltOutlinedIcon />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#1976d2"
      bgcolorHover="#1976d2"
      fontColor="#ffffff"
      tooltipPlacement="bottom"
      className={props.className}
      id={props.id}
    />
  );
};

export const BtnDelete = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "ลบ",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<DeleteForever />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#ed3847"
      bgcolorHover="#ed3847"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

export const BtnCancelForm = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "ยกเลิก",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<CloseRounded />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#ed3847"
      bgcolorHover="#ed3847"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

export const BtnPreview = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "Preview",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<Info />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#e39a2d"
      bgcolorHover="#e39a2d"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

export const BtnClose = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "ปิด",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<Cancel />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#8c98ac"
      bgcolorHover="#8c98ac"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

export const BtnCancel = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "ยกเลิก",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<CloseRounded />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#888888"
      bgcolorHover="#888888"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};


export const BtnBack = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "กลับ",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<ArrowBackIos />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#888888"
      bgcolorHover="#888888"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};


export const BtnAdd = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "เพิ่ม",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<Add />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#05a6e8"
      bgcolorHover="#05a6e8"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};


export const BtnSearch = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "ค้นหา",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<Search />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#0070ff"
      bgcolorHover="#0b5ec9"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

export const BtnClear = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "ล้าง",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<RefreshRounded />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#dcdbdb"
      bgcolorHover="#b7b7b7"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

export const BtnHome = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "หน้าหลัก",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<Home />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#dcdcdc"
      bgcolorHover="#dcdcdc"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

export const BtnEdit = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "แก้ไข",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<BiEdit />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      // bgcolor="#b8b8b8"
      bgcolor="#F6C000"
      bgcolorHover="#F6C000"
      // bgcolorHover="#b8b8b8"
      fontColor="#ffffff"
      // fontColor="#F6C000"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

export const BtnExportExcel = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "Excel",
    isCircleWithOutText = false,
    isRadius = true,
    icon = <BsFileEarmarkExcel />
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={icon}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#34956d"
      bgcolorHover="#1e855b"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

export const BtnDownload = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "Download",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<SaveAlt />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#1000f3"
      bgcolorHover="#1000f3"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

export const BtnDraft = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "บันทึกร่าง",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<HiOutlineSave />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#3cc1ac"
      bgcolorHover="#239b88"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

export const BtnAdditionnel = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "ดูรายละเอียด",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<List />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#43619D"
      bgcolorHover="#496397"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

export const BtnRecycle = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "นำกลับมาใช้ใหม่",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<MdRecycling />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#f59a23"
      bgcolorHover="#e6880c"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

export const BtnNote = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "โน๊ต",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<Summarize />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#f59a23"
      bgcolorHover="#e6880c"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

//#region OnTable
export const BtnAddOnTable = ({
  IsDisabled = false,
  IsHisabled = false,
  txt = "เพิ่ม",
  onClick = () => { },
  id
}) => (
  <GridActionsCellItem
    id={id}
    disabled={IsDisabled}
    hidden={IsHisabled}
    icon={<Tooltip title={txt}><Add /></Tooltip>}
    label={txt}
    sx={{
      bgcolor: "#1976d2",
      color: "white",
      ":hover": {
        bgcolor: "#0946a2",
      },
    }}
    onClick={onClick}
    aria-label={txt}
  />
);

export const BtnPreviewOnTable = ({
  IsDisabled = false,
  IsHisabled = false,
  txt = "Preview",
  onClick = () => { },
  id
}) => (
  <GridActionsCellItem
    id={id}
    disabled={IsDisabled}
    hidden={IsHisabled}
    icon={<Tooltip title={txt}><RemoveRedEye /></Tooltip>}
    label={txt}
    sx={(theme: Theme) => ({
      color: "#fff",
      backgroundColor: theme.palette.info.main,
      borderColor: theme.palette.info.light,
      ":hover": { bgcolor: theme.palette.info.dark },
    })}
    onClick={onClick}
    aria-label={txt}
  />
);

export const BtnLinkOnTable = ({
  IsDisabled = false,
  IsHisabled = false,
  txt = "Link",
  onClick = () => { },
  id
}) => (
  <GridActionsCellItem
    id={id}
    disabled={IsDisabled}
    hidden={IsHisabled}
    icon={<Tooltip title={txt}><Link /></Tooltip>}
    label={txt}
    sx={(theme: Theme) => ({
      color: "#fff",
      backgroundColor: "#9e3eda",
      borderColor: "#9e3eda",
      ":hover": { bgcolor: "#671d96" },
    })}
    onClick={onClick}
    aria-label={txt}
  />
);

export const BtnViewImageOnTable = ({
  IsDisabled = false,
  IsHisabled = false,
  txt = "ดูรูปภาพ",
  onClick = () => { },
  id
}) => (
  <GridActionsCellItem
    id={id}
    disabled={IsDisabled}
    hidden={IsHisabled}
    icon={<Tooltip title={txt}><Image /></Tooltip>}
    label={txt}
    sx={{
      backgroundColor: "tranparent",
      color: "#4f5bef",
      ":hover": { bgcolor: "#d7d7d7" },
    }}
    onClick={onClick}
    aria-label={txt}
  />
)

export const BtnEditOnTable = ({
  IsDisabled = false,
  IsHisabled = false,
  txt = "แก้ไข",
  onClick = () => { },
  id
}) => (
  <Tooltip title={txt}>
    <GridActionsCellItem
      id={id}
      disabled={IsDisabled}
      hidden={IsHisabled}
      icon={<Edit />}
      label={txt}
      sx={
        IsHisabled !== true ? {
          backgroundColor: "#ffc107",
          color: "white",
          ":hover": { bgcolor: "#cc9900" },
          margin: "1%",
        }
          :
          {
            display: "none",
            backgroundColor: "#ffc107",
            color: "white",
            ":hover": { bgcolor: "#cc9900" },
            margin: "1%",
          }
      }
      onClick={onClick}
      aria-label={txt}
    />
  </Tooltip>
)

export const BtnViewOnTable = ({
  IsDisabled = false,
  IsHisabled = false,
  txt = "รายละเอียด",
  onClick = () => { },
  id
}) => (
  <Tooltip title={txt}>
    <GridActionsCellItem
      id={id}
      disabled={IsDisabled}
      hidden={IsHisabled}
      icon={<Visibility />}
      label={txt}
      sx={{
        backgroundColor: "#6FDBFF",
        color: "white",
        ":hover": { bgcolor: "#5DB6D4" },
        margin: "1%",
      }}
      onClick={onClick}
      aria-label={txt}
    />
  </Tooltip>
)

export const BtnDeleteOnTable = ({
  IsDisabled = false,
  IsHisabled = false,
  txt = "ลบ",
  onClick = () => { },
  id
}) => (
  <GridActionsCellItem
    id={id}
    disabled={IsDisabled}
    hidden={IsHisabled}
    icon={<Tooltip title={txt}><Delete /></Tooltip>}
    label={txt}
    sx={{
      backgroundColor: "#f30800",
      color: "white", //black
      ":hover": { bgcolor: "#d8352f" },
      margin: "1%",
    }}
    onClick={onClick}
    aria-label={txt}
  />
)

export const BtnSearchOnTable = ({
  IsDisabled = false,
  IsHisabled = false,
  txt = "ค้นหา",
  onClick = () => { },
  id
}) => (
  <Tooltip title={txt}>
    <GridActionsCellItem
      id={id}
      disabled={IsDisabled}
      hidden={IsHisabled}
      icon={<Search />}
      label={txt}
      sx={{
        backgroundColor: "#096ddd",
        // backgroundColor: "#1000f3",
        color: "white", //black
        ":hover": { bgcolor: "#004290" },
        // ":hover": { bgcolor: "#2d22b9" },
      }}
      onClick={onClick}
      aria-label={txt}
    />
  </Tooltip>
)

export const BtnPrintOnTable = ({
  IsDisabled = false,
  IsHisabled = false,
  txt = "Print",
  onClick = () => { },
  id
}) => (
  <Tooltip title={txt}>
    <Print
      sx={{
        color: "orange",
        ":hover": { cursor: "pointer" },
      }}
      onClick={onClick}
    />
  </Tooltip>
)

export const BtnReserveOnTable = ({
  IsDisabled = false,
  IsHisabled = false,
  txt = "Reserve",
  onClick = () => { },
  id
}) => (
  <GridActionsCellItem
    id={id}
    disabled={IsDisabled}
    hidden={IsHisabled}
    icon={<Tooltip title={txt}><Edit /></Tooltip>}
    label={txt}
    sx={{
      backgroundColor: "#1000f3",
      color: "white", //black
      ":hover": { bgcolor: "#2d22b9" },
    }}
    onClick={onClick}
    aria-label={txt}
  />
)

export const BtnDownloadOnTable = ({
  IsDisabled = false,
  IsHisabled = false,
  txt = "Download",
  onClick = () => { },
  id
}) => (
  <GridActionsCellItem
    id={id}
    disabled={IsDisabled}
    hidden={IsHisabled}
    icon={<Tooltip title={txt}><SaveAlt /></Tooltip>}
    label={txt}
    sx={{
      backgroundColor: "#4db9cf",
      color: "white", //black
      ":hover": { bgcolor: "#4db9cf" },
      margin: "1%",
    }}
    onClick={onClick}
    aria-label={txt}
  />
)

export const BtnClearOnTable = ({
  IsDisabled = false,
  IsHisabled = false,
  txt = "ล้าง",
  onClick = () => { },
  id
}) => (
  <GridActionsCellItem
    id={id}
    disabled={IsDisabled}
    hidden={IsHisabled}
    icon={<Tooltip title={txt}><Clear /></Tooltip>}
    label={txt}
    sx={{
      backgroundColor: "#f32400",
      color: "white",
      ":hover": { bgcolor: "#f32400" },
      margin: "1%",
    }}
    onClick={onClick}
    aria-label={txt}
  />
)

export const BtnReject = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "Reject",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<Undo />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#ed3847"
      bgcolorHover="#ed3847"
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

export const BtnDes = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "Description",
    isCircleWithOutText = false,
    isRadius = true,
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={<DescriptionIcon />}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor="#5197ff" bgcolorHover='#0f80d7'
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};

export const BtnExportExcelTemplate = (props: BtnProp) => {
  const {
    isDisabled = false,
    isHidden = false,
    onClick = () => { },
    txt = "Excel",
    isCircleWithOutText = false,
    isRadius = true,
    icon = <DescriptionIcon />
  } = props;

  return (
    <BtnBaseButton
      txt={txt}
      size={"medium"}
      startIcon={icon}
      isRadius={isRadius}
      isDisabled={isDisabled}
      isHidden={isHidden}
      onClick={onClick}
      isCircleWithOutText={isCircleWithOutText}
      bgcolor={blue[500]}
      bgcolorHover={blue[700]}
      fontColor="#ffffff"
      tooltipPlacement="bottom"

      className={props.className}
      id={props.id}
    />
  );
};



export const BtnSubOnTable = ({
  IsDisabled = false,
  IsHisabled = false,
  txt = "ดูข้อมูล",
  onClick = () => { },
  id
}) => (
  <GridActionsCellItem
    id={id}
    disabled={IsDisabled}
    hidden={IsHisabled}
    icon={<Tooltip title={txt}><DehazeIcon /></Tooltip>}
    label={txt}
    sx={{
      // bgcolor: "#1976d2",
      color: "#1976d2",
      ":hover": {
        bgcolor: "#0946a2",
      },
    }}
    onClick={onClick}
    aria-label={txt}
  />
);

export const BtnViewDataOnTable = ({
  IsDisabled = false,
  IsHisabled = false,
  txt = "ดูข้อมูล",
  onClick = () => { },
  id
}) => (
  <GridActionsCellItem
    id={id}
    disabled={IsDisabled}
    hidden={IsHisabled}
    icon={<Tooltip title={txt}><DescriptionIcon /></Tooltip>}
    label={txt}
    sx={
      IsHisabled !== true ? {
        backgroundColor: "#1976d2",
        color: "white",
        ":hover": { bgcolor: "#0946a2" },
        margin: "1%",
      }
        :
        {
          display: "none",
          backgroundColor: "#1976d2",
          color: "white",
          ":hover": { bgcolor: "#0946a2" },
          margin: "1%",
        }
    }
    // sx={{
    //   // bgcolor: "#1976d2",
    //   color: "#1976d2",
    //   ":hover": {
    //     bgcolor: "#0946a2",
    //   },
    // }}
    onClick={onClick}
    aria-label={txt}
  />
);

export const BtnPreviewTable = ({
  IsDisabled = false,
  IsHisabled = false,
  txt = "รายละเอียด",
  onClick = () => { },
  id
}) => (
  <GridActionsCellItem
    id={id}
    disabled={IsDisabled}
    hidden={IsHisabled}
    icon={<Tooltip title={txt}><MenuIcon /></Tooltip>}
    label={txt}
    sx={(theme: Theme) => ({
      color: "#fff",
      backgroundColor: theme.palette.info.main,
      borderColor: theme.palette.info.light,
      ":hover": { bgcolor: theme.palette.info.dark },
    })}
    onClick={onClick}
    aria-label={txt}
  />
);

export const BtnUpdateDataOnTable = ({
  IsDisabled = false,
  IsHisabled = false,
  txt = "อัปเดตผลการดำเนินงาน",
  onClick = () => { },
  id
}) => (
  <GridActionsCellItem
    id={id}
    disabled={IsDisabled}
    hidden={IsHisabled}
    //ม่วง
    icon={<Tooltip title={txt}><UploadFile /></Tooltip>}
    label={txt}
    sx={
      IsHisabled !== true ? {
        backgroundColor: "#A569BD",
        color: "white",
        ":hover": { bgcolor: "#7D3C98" },
        margin: "1%",
      }
        :
        {
          display: "none",
          backgroundColor: "#A569BD",
          color: "white",
          ":hover": { bgcolor: "#7D3C98" },
          margin: "1%",
        }
    }
    onClick={onClick}
    aria-label={txt}
  />
);

export const BtnApproveOnTable = ({
  IsDisabled = false,
  IsHisabled = false,
  txt = "อนุมัติใบงาน",
  onClick = () => { },
  id
}) => (
  <GridActionsCellItem
    id={id}
    disabled={IsDisabled}
    hidden={IsHisabled}
    icon={<Tooltip title={txt}><DoneAll /></Tooltip>}
    label={txt}
    //เขียว
    sx={
      IsHisabled !== true ? {
        backgroundColor: "#58D68D",
        color: "white",
        ":hover": { bgcolor: "#2ECC71" },
        margin: "1%",
      }
        :
        {
          display: "none",
          backgroundColor: "#58D68D",
          color: "white",
          ":hover": { bgcolor: "#2ECC71" },
          margin: "1%",
        }
    }
    onClick={onClick}
    aria-label={txt}
  />
);

export const BtnExcel = ({ onClick, nWidth = '2em', nHeight = '2em' }) => (
  <Tooltip title="Excel">
    <IconButton
      size="small"
      aria-label="close"
      onClick={onClick}
    >
      <img src={excelIcon} alt={"Excel"} style={{ width: nWidth, height: nHeight, maxWidth: '150%', }} />
    </IconButton>
  </Tooltip>
)

export const BtnPDF = ({ onClick, nWidth = '2em', nHeight = '2em' }) => (
  <Tooltip title="PDF">
    <IconButton
      size="small"
      aria-label="close"
      onClick={onClick}
    >
      <img src={pdfIcon} alt={"PDF"} style={{ width: nWidth, height: nHeight }} />
    </IconButton>
  </Tooltip>
)

//#endregion
