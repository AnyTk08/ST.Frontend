import { Fragment, useCallback, useContext, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FilePopup from "../PopUp/FilePopup";
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Extension } from "utilities/ST_Function";
import { CircularProgressLabelCard } from "../StyleCpnExport";
import PostAddIcon from '@mui/icons-material/PostAdd';
import mp4file from "./../../../../../assets/images/TypeFile/mp4-file.png";
import pptfile from "./../../../../../assets/images/TypeFile/ppt-file.png";
import pdffile from "./../../../../../assets/images/TypeFile/pdf-file.png";
import docfile from "./../../../../../assets/images/TypeFile/doc-file.png";
import xlsfile from "./../../../../../assets/images/TypeFile/xls-file.png";
import { ProviderUploadFile, downloadFile } from "../../UploadFile";
import No_BG from "assets/images/NoImage/no-image-available.png";
import ModalAddDescription from "../PopUp/ModalAddDescription";

const ItemCard = (props) => {

    const { 
        sPopup, } = props;

    const {
        IsAddDescription,
    } = useContext(ProviderUploadFile);


    const [indexActive, setindexActive] = useState(0)
    const matches440 = useMediaQuery('(min-width:440px)');
    const [isIopen, setisIopen] = useState(false)
    const [IsopenPopUpDetail, setIsopenPopUpDetail] = useState(false)

    const ClosePopUp = () => {
        setIsopenPopUpDetail(false);
    };

    const OpenPopUp = () => {
        let lstSrc = [] as any;
        props.arrFile.forEach(element => {
            if (Extension.Image.indexOf(element.sFileType) > -1 && element.sFileLink) {
                let sSrc = element.sFileLink.search("http") > -1 ? element.sFileLink : process.env.REACT_APP_API_URL + element.sFileLink
                lstSrc.push({ src: sSrc, sFileName: element.sFileName, nFile_ID: element.nFile_ID })
            }
        });
        let nIdexFile = lstSrc.findIndex(f => f.nFile_ID === props.nFile_ID);
        setindexActive(nIdexFile > -1 ? nIdexFile : 0)
        

        if (props.onOpenFile) {
            props.onOpenFile(props.nFile_ID);
        }
        setIsopenPopUpDetail(true);
    };

    const onDownload = () => {
        downloadFile(props.sFileLink, props.sFileName)
    };

    const onClickFile = () => {
        if (props.onOpenFile) {
            props.onOpenFile(props.nFile_ID);
        }
        let isCheck = Extension.Image.indexOf(props.sFileType.toLowerCase()) > -1 || Extension.Video.indexOf(props.sFileType.toLowerCase()) > -1 ;
        
        isCheck ? OpenPopUp() : onDownload()
    };

    const callBaclTooltipDescription =useCallback(()=>{
        return (
            <Tooltip title={props.sDescription}>
                <Typography variant="body2" color="text.secondary" className="div-gallery-title">
                    {props.sFileName}
                </Typography>
            </Tooltip>
        )
    }, [props.sDescription,props.sFileName,isIopen])
    

    const onImageError = (e) => {
        e.target.src = No_BG;
    }

    return (
        <Fragment>
            <Card sx={{ maxWidth: matches440 ? 200 : 400, height: 187 }} >
                <CardActionArea style={{ position: 'relative', width: '100%' }}>
                    {
                        props.sProgress !== "100" && !props.IsCompleted &&
                        <Box display="flex" alignItems="center" className="div-gallery-icon">
                            <Box width="100%" p={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgressLabelCard
                                    value={parseInt(props.sProgress) || 0}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                    }}
                                />
                            </Box>
                        </Box>
                    }
                    {Extension.Image.indexOf(props.sFileType.toLowerCase()) > -1 ?
                        <CardMedia
                            component="img"
                            image={props.sFileLink}
                            alt="Image"
                            className="div-gallery-img"
                            onClick={onClickFile}
                            onError={onImageError}
                        />
                        : null}
                    {Extension.Video.indexOf(props.sFileType.toLowerCase()) > -1 ?
                        <CardMedia
                            component="img"
                            image={mp4file}
                            alt="MP4"
                            className="div-gallery-typeFile"
                            onClick={onClickFile}
                        />
                        : null}

                    {Extension.PDF.indexOf(props.sFileType.toLowerCase()) > -1 ?
                        <CardMedia
                            component="img"
                            image={pdffile}
                            alt="PDF"
                            className="div-gallery-typeFile"
                            onClick={onClickFile}
                        />
                        : null}
                    {Extension.Word.indexOf(props.sFileType.toLowerCase()) > -1 ?
                        <CardMedia
                            component="img"
                            image={docfile}
                            alt="DOC"
                            className="div-gallery-typeFile"
                            onClick={onClickFile}
                        />
                        : null}
                    {Extension.Excel.indexOf(props.sFileType.toLowerCase()) > -1 ?
                        <CardMedia
                            component="img"
                            image={xlsfile}
                            alt="XLS"
                            className="div-gallery-typeFile"
                            onClick={onClickFile}
                        />
                        : null}
                    {Extension.PowerPoint.indexOf(props.sFileType.toLowerCase()) > -1 ?
                        <CardMedia
                            component="img"
                            image={pptfile}
                            alt="PPT"
                            className="div-gallery-typeFile"
                            onClick={onClickFile}
                        />
                        : null}
                    <div style={{ position: "absolute", right: 4, top: 4 }}>
                        {props.IsCompleted && !props.disabled && IsAddDescription ? (
                            <Tooltip title="เพิ่มคำบรรยาย">
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        console.log("isIopen", props.sFileName);
                                        setisIopen(true)
                                    }}
                                    className={"mui-style-addDetailColor"}
                                >
                                    <PostAddIcon />
                                </IconButton>
                            </Tooltip>
                        ) : null}

                        {props.IsCompleted && !props.disabled ? (
                            <Tooltip title="ลบ">
                                <IconButton
                                    size="small"
                                    style={{ marginLeft: '4px' }}
                                    onClick={() => {
                                        props.onDelete(props.nFile_ID);
                                    }}
                                    className={"mui-style-DangerColor"}
                                >
                                    <DeleteForeverIcon />
                                </IconButton>
                            </Tooltip>
                        ) : null}
                    </div>
                </CardActionArea>
                <CardContent style={{ padding: '8px', background: '#f5f5f5' }}>
                    {callBaclTooltipDescription()}
                    {/* <Tooltip title={ props.sDescription}>
                        <Typography variant="body2" color="text.secondary" className="div-gallery-title">
                            {props.sFileName}
                        </Typography>
                    </Tooltip> */}
                </CardContent>
            </Card>
            <ModalAddDescription
                IsOpen={isIopen}
                setIsOpen={setisIopen}
                sDescription={props.sDescription}
                sFileName={props.sFileName}
                dtRow={props.dtRow}
            />
            <FilePopup
                file={props}
                IsopenPopUp={IsopenPopUpDetail}
                ClosePopUp={ClosePopUp}
                sCropFileLink={props.sCropFileLink}
                sFileName={props.sFileName}
                IsCrop={false}  //No Crop Gallery
                nFile_ID={props.nFile_ID}
                isGallery={Extension.Image.indexOf(props.sFileType.toLowerCase()) > -1}
                arrFile={props.arrFile}
                setStartVideoOn={props.setStartVideoOn}
                nStartVideoOn={props.nStartVideoOn}
                CannotSkipForward={props.CannotSkipForward}
                onVideoEnd={props.onVideoEnd}
                onDelete={props.onDelete}
                indexActive={indexActive}
                sPopup={sPopup}
            />

        </Fragment>
    );
};

export default ItemCard;

