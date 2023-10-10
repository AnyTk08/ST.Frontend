import React, { Fragment, SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button, ButtonGroup, DialogContent, DialogTitle, Grid } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Extension } from "utilities/ST_Function";
import ReactPlayer from "react-player";
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';
import axios from "axios";
import { AuthToken } from "config/AxiosConfig";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import CropRoundedIcon from '@mui/icons-material/CropRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import { Transition } from "../StyleCpnExport";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { BtnBaseButton, BtnCancel, BtnConfirm } from "components/Button";

export default function FilePopup(props) {

    const {
        SendCropImage,
        IsopenPopUp,
        sPopup,
        IsCrop,
        cropShape,
        cropRatio,
        cropResize,
        cropMovable,
    } = props;

    const cropperRef = useRef(null);

    const [lstDocumentFile, setlstDocumentFile] = useState([] as any)

    const [image, setImage] = useState<any>(props.file.sCropFileLink ? (props.file.sCropFileLink.search("http") > -1 ? props.file.sCropFileLink : process.env.REACT_APP_API_URL + props.file.sCropFileLink) : "");
    const [indexlstImage, setindexlstImage] = useState(0)
    const [isCrop, setisCrop] = useState(false)
    //Video
    const [isReady, setIsReady] = useState(false);
    const playerRef = useRef({} as any);
    const [nPlayedTime, setPlayedTime] = useState(props.nStartVideoOn || 0);
    const [isShowAlert, setIsShowAlert] = useState(false);

    const lstImage = useMemo(() => {
        let lstSrc = [] as any;
        if (props.arrFile && props.isGallery) {
            props.arrFile.forEach(element => {
                if (Extension.Image.indexOf(element.sFileType) > -1 && element.sFileLink) {
                    let sSrc = element.sFileLink.search("http") > -1 ? element.sFileLink : process.env.REACT_APP_API_URL + element.sFileLink
                    lstSrc.push({ src: sSrc, sFileName: element.sFileName })
                }
            });
        }
        return lstSrc;
    }, [props.arrFile, props.isGallery])

    useEffect(() => {
        if (IsopenPopUp) {
            setisCrop(false)
        }
    }, [IsopenPopUp]);


    useEffect(() => {
        setlstDocumentFile([])
        if (Extension.Document.indexOf(props.file.sCropFileLink) > -1 && props.file.sFileLink) {
            let sURI = props.file.sFileLink.search("http") > -1 ? props.file.sFileLink : process.env.REACT_APP_API_URL + props.file.sFileLink;
            setlstDocumentFile([{ uri: sURI }])
        }
        if (props.file.sCropFileLink) {
            let sPathImage = props.file.sCropFileLink.search("http") > -1 ? props.file.sCropFileLink : process.env.REACT_APP_API_URL + props.file.sCropFileLink;
            setImage(sPathImage)
        }
    }, [props.file]);

    const DownloadOriginal = () => {

        let sImage = props.isGallery ? lstImage[indexlstImage]?.src : image;
        let sFileName = props.isGallery ? lstImage[indexlstImage]?.sFileName : props.file.sFileName;

        if (props.isGallery || Extension.Video.indexOf(props.file.sFileType) > -1) {
            let sMimeType = "";
            switch (props.file.sFileType) {
                case "png":
                    sMimeType = "image/png";
                    break;
                case "jpeg":
                    sMimeType = "image/jpeg";
                    break;
                case "mp4":
                    sMimeType = "video/mp4";
                    break;
                case "avi":
                    sMimeType = "video/AV1";
                    break;
                case "zip":
                    sMimeType = "application/zip";
                    break;
                case "rar":
                    sMimeType = "application/x-rar-compressed";
                    break;
                default:
                    sMimeType = "image/png";
                    break;
            }

            const auth_token = AuthToken.get() as string;
            axios({
                method: 'GET',
                headers: { Authorization: `Bearer ${auth_token}` },
                url: sImage,
                responseType: 'blob'
            })
                .then(response => {
                    const blob = new Blob([response.data], { type: sMimeType })

                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = sFileName;
                    a.click();
                    document.body.removeChild(a);
                });
        }
        else {
            let link = document.createElement("a"); //Create <a>
            link.href = image; //Image Goes here
            link.target = "_blank"; //Image Goes here
            link.download = props.file.sFileName; //File name Here
            document.body.appendChild(link);
            link.click(); //Downloaded file
            document.body.removeChild(link);
        }
    };

    const onReady = useCallback(() => {
        if (!isReady) {
            if (props.nStartVideoOn) {
                const timeToStart = props.nStartVideoOn;
                playerRef.current.seekTo(timeToStart, "seconds");
            }
            setIsReady(true);
        }
    }, [isReady, props.nStartVideoOn]);

    const onClosePopup = () => {
        if (props.setStartVideoOn) {
            props.setStartVideoOn(nPlayedTime);
        }
        props.ClosePopUp();
    };

    const onCloseAlert = (
        event: SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setIsShowAlert(false);
    };

    const onActionAlert = (
        <Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={onCloseAlert}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
    );

    const onSetCrop = () => {
        let sPath = !props.file?.sFileLink ? "" : props.file.sFileLink.search("http") > -1 ? props.file.sFileLink : process.env.REACT_APP_API_URL + props.file.sFileLink;
        setImage(sPath)
        setisCrop(true)
    };

    const onSubmitCrop = async () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        const base64 = cropper.getCroppedCanvas().toDataURL();
        SendCropImage(props.file.sUrl, base64, props.file.nFile_ID);
        setisCrop(false)
        onClosePopup()
    };

    const rotate = () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        cropper.rotate(90);
    };

    const deleteInDialog = () => {
        props.onDelete(props.file.nFile_ID, false);
        onClosePopup();
    }

    const jsxContentDialogFullScreen = () => {
        return (
            <>
                <AppBar className={"appBar-uploadfile"}>
                    <Toolbar>
                        <Grid container spacing={2} justifyContent="space-between" alignItems={"center"}>
                            <Grid item xs={7} md={"auto"} >
                                <Grid container spacing={0}>
                                    <Grid item xs={12} className={"HeadLable"}>
                                        ชื่อไฟล์ : {" "}<span className={"SubLable"}>{props.file.sFileName}</span>
                                    </Grid>
                                    <Grid item xs={12} className={"HeadLable"}>
                                        นามสกุลไฟล์ : {" "}<span className={"SubLable"}>{props.file.sFileType}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={5} md={"auto"} >
                                <Grid container spacing={1} justifyContent={'end'}>
                                    <Grid item xs={"auto"}>
                                        {
                                            isCrop ?
                                                <Grid item xs={"auto"}>
                                                    <Grid container spacing={1} justifyContent={'end'}>
                                                        <Grid item xs={"auto"}>
                                                            <BtnConfirm
                                                                id="confirm-crop"
                                                                className="btn-download-modal"
                                                                onClick={() => { onSubmitCrop(); }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={"auto"}>
                                                            <BtnCancel
                                                                id="cancel-crop"
                                                                className="btn-cancel-modal"
                                                                onClick={() => { setisCrop(false); }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                :
                                                <Grid item xs={"auto"}>
                                                    <BtnBaseButton
                                                        txt={"ดาวน์โหลด"}
                                                        size={"medium"}
                                                        startIcon={<CloudDownloadIcon />}
                                                        isRadius={true}
                                                        isDisabled={false}
                                                        isHidden={false}
                                                        onClick={DownloadOriginal}
                                                        isCircleWithOutText={false}
                                                        className="btn-download-modal"
                                                        id={"download-modal"}
                                                    />
                                                </Grid>
                                        }
                                    </Grid>
                                    <Grid item xs={"auto"} style={{ display: isCrop ? "none" : "block" }}>
                                        <BtnBaseButton
                                            txt={"ปิด"}
                                            size={"medium"}
                                            startIcon={<CloseIcon />}
                                            isRadius={true}
                                            isDisabled={false}
                                            isHidden={false}
                                            onClick={onClosePopup}
                                            isCircleWithOutText={false}
                                            className="btn-close-modal"
                                            id={"close-modal"}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <DialogContent className={"body-uploadfile"} dividers>
                    <>
                        <Grid
                            container
                            spacing={0}
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            style={{ height: "85vh", marginTop: '70px', position: 'relative' }}
                        >
                            {
                                props.isGallery ?
                                    <>
                                        <Grid item xs={12}>
                                            <Carousel
                                                className="div-gallery"
                                                images={lstImage}
                                                key={"crs-image"}
                                                canAutoPlay={false}
                                                isAutoPlaying={true}
                                                autoPlayInterval={3000}
                                                index={props.indexActive}
                                                onIndexChange={({ curIndex, curIndexForDisplay }) => {
                                                    setindexlstImage(curIndex)
                                                }}
                                                leftIcon={
                                                    <span
                                                        className='icon-text'
                                                        role='img'
                                                        aria-label='left'
                                                        style={{
                                                            fontSize: 'min(50px, 5vw)'
                                                        }}
                                                    >
                                                        ◀️
                                                    </span>
                                                }
                                                rightIcon={
                                                    <span
                                                        className='icon-text'
                                                        role='img'
                                                        aria-label='right'
                                                        style={{
                                                            fontSize: 'min(50px, 5vw)'
                                                        }}
                                                    >
                                                        ▶️
                                                    </span>
                                                }

                                            />
                                        </Grid>
                                    </>
                                    :
                                    <>
                                        {/* Image */}
                                        {Extension.Image.indexOf(props.file.sFileType) > -1 && (
                                            <Grid item xs={12} style={{ display: "flex" }}>
                                                {
                                                    isCrop ?
                                                        <>
                                                            <Cropper
                                                                src={image}
                                                                id="images"
                                                                zoomTo={0.1945}
                                                                aspectRatio={cropRatio}
                                                                minCropBoxHeight={200}
                                                                minCropBoxWidth={200}
                                                                viewMode={3}
                                                                className={cropShape === "retangle" ? "image-modal" : "image-modal circle-crop"}
                                                                guides={true}
                                                                highlight={true}
                                                                zoomOnTouch={false}
                                                                zoomOnWheel={false}
                                                                cropBoxMovable={cropMovable}
                                                                zoomable={true}
                                                                cropBoxResizable={cropResize}
                                                                responsive={true}
                                                                ref={cropperRef}
                                                            />
                                                        </>
                                                        :
                                                        <>
                                                            <img src={image} alt="" className="image-modal" />
                                                        </>
                                                }
                                            </Grid>

                                        )}
                                        {/* Video */}
                                        {Extension.Video.indexOf(props.file.sFileType) > -1 && (
                                            <Grid item xs={12} >
                                                <div className="player-wrapper">
                                                    <ReactPlayer
                                                        ref={playerRef}
                                                        config={{
                                                            file: {
                                                                attributes: { controlsList: "nodownload" },
                                                            },
                                                        }}
                                                        className="react-player"
                                                        url={image}
                                                        width="100%"
                                                        height="100%"
                                                        playing={true}
                                                        controls={true}
                                                        pip={true}
                                                        stopOnUnmount={true}
                                                        onProgress={(playedSeconds) => {
                                                            let nProgress = playedSeconds.playedSeconds || 0;
                                                            if (props.CannotSkipForward) {
                                                                if (nProgress > nPlayedTime) {
                                                                    if (nProgress - nPlayedTime < 2) {
                                                                        setPlayedTime(nProgress);
                                                                    }
                                                                }
                                                            } else {
                                                                setPlayedTime(nProgress);
                                                            }
                                                        }}
                                                        onReady={onReady}
                                                        onSeek={(nSeekTo) => {
                                                            if (props.CannotSkipForward) {
                                                                if (nSeekTo > nPlayedTime) {
                                                                    playerRef.current.seekTo(
                                                                        nPlayedTime,
                                                                        "seconds"
                                                                    );
                                                                    setIsShowAlert(true);
                                                                }
                                                            }
                                                            if (props.onVideoEnd) {
                                                                props.onVideoEnd(false);
                                                            }
                                                        }}
                                                        onEnded={() => {
                                                            if (props.onVideoEnd) {
                                                                props.onVideoEnd(true);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </Grid>
                                        )}
                                        {/* PDF */}
                                        {/* {(Extension.PDF.indexOf(props.file.sFileType) > -1 || Extension.Word.indexOf(props.file.sFileType) > -1 || Extension.Excel.indexOf(props.file.sFileType) > -1 || Extension.PowerPoint.indexOf(props.file.sFileType) > -1) && ( */}
                                        {Extension.PDF.indexOf(props.file.sFileType) > -1 && (
                                            <>
                                                <Grid item xs={12} >
                                                    <DocViewer
                                                        documents={lstDocumentFile}
                                                        pluginRenderers={DocViewerRenderers}
                                                        config={{
                                                            header: {
                                                                disableHeader: false,
                                                                disableFileName: false,
                                                                retainURLParams: false,
                                                            },
                                                            pdfZoom: {
                                                                defaultZoom: 0.8, // 1 as default,
                                                                zoomJump: 0.2, // 0.1 as default,
                                                            },
                                                            pdfVerticalScrollByDefault: true, // false as default
                                                        }}
                                                        theme={{
                                                            primary: "#5296d8",
                                                            secondary: "#ffffff",
                                                            tertiary: "#5296d899",
                                                            textPrimary: "#ffffff",
                                                            textSecondary: "#5296d8",
                                                            textTertiary: "#00000099",
                                                            disableThemeScrollbar: false,
                                                        }}
                                                        style={{ width: "100%", height: "100%" }}
                                                    />
                                                </Grid>
                                            </>

                                        )}
                                    </>
                            }
                            <div style={{ display: IsCrop && Extension.Image.indexOf(props.file.sFileType) > -1 ? "block" : "none" }}>
                                <ButtonGroup
                                    disableElevation
                                    variant="text"
                                    aria-label="Disabled elevation buttons"
                                    style={{
                                        borderColor: '#fff'
                                    }}
                                >
                                    {
                                        !isCrop ?
                                            <Button
                                                startIcon={<CropRoundedIcon style={{ color: '#fff' }} />}
                                                onClick={() => { onSetCrop() }}
                                                style={{ color: '#fff' }}
                                            >
                                                Crop
                                            </Button>
                                            :
                                            <Button
                                                startIcon={<RefreshRoundedIcon style={{ color: '#fff' }} />}
                                                onClick={() => { rotate() }}
                                                style={{ color: '#fff' }}
                                            >
                                                Rotate
                                            </Button>
                                    }
                                    <Button
                                        startIcon={<DeleteForeverRoundedIcon style={{ color: '#fff' }} />}
                                        onClick={deleteInDialog}
                                        style={{ color: '#fff' }}
                                    >
                                        Delete
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </Grid>
                    </>
                </DialogContent>
            </>
        )
    }

    const jsxContentDialogModal = () => {
        return (
            <>
                <DialogTitle style={{ padding: "12px 24px" }}>
                    <Grid container spacing={2} justifyContent="space-between">
                        <Grid item xs={7} md={"auto"} >
                            <Grid container spacing={2}>
                                <Grid item xs={10} md={"auto"} className={"HeadLable2"}>
                                    ชื่อไฟล์ : {" "}
                                    <div className={"SubLable2"}>{props.file.sFileName}</div>
                                </Grid>
                                <Grid item xs={2} md={"auto"} className={"HeadLable2"}>
                                    นามสกุลไฟล์ : {" "}
                                    <div className={"SubLable2"}>{props.file.sFileType}</div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={5} md={"auto"} >
                            <Grid container justifyContent={'end'}>
                                <Grid item xs={"auto"}>
                                    {
                                        isCrop ?

                                            <Grid item xs={"auto"}>
                                                <Grid container spacing={1} justifyContent={'end'}>
                                                    <Grid item xs={"auto"}>
                                                        <Button variant="outlined" className="btn-cancel-crop" onClick={() => { setisCrop(false) }}>Cancel</Button>
                                                    </Grid>
                                                    <Grid item xs={"auto"}>
                                                        <Button variant="outlined" className="btn-download-modal" onClick={() => { onSubmitCrop(); }}>Confirm</Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            :
                                            <Grid item xs={"auto"}>
                                                <Button variant="outlined" className="btn-download-modal" onClick={() => { DownloadOriginal(); }}>Download</Button>
                                            </Grid>
                                    }
                                </Grid>
                                <Grid item xs={"auto"} style={{ display: isCrop ? "none" : "block" }}>
                                    <IconButton
                                        edge="end"
                                        color="inherit"
                                        onClick={onClosePopup}
                                        aria-label="close"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid
                        container
                        spacing={2}
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {
                            props.isGallery ?
                                <>
                                    <Grid item xs={12}>
                                        <Carousel
                                            className="div-gallery"
                                            images={lstImage}
                                            key={"crs-image"}
                                            canAutoPlay={false}
                                            isAutoPlaying={true}
                                            autoPlayInterval={3000}
                                            index={props.indexActive}
                                            onIndexChange={({ curIndex, curIndexForDisplay }) => {
                                                setindexlstImage(curIndex)
                                            }}
                                            leftIcon={
                                                <span
                                                    className='icon-text'
                                                    role='img'
                                                    aria-label='left'
                                                    style={{
                                                        fontSize: 'min(50px, 5vw)'
                                                    }}
                                                >
                                                    ◀️
                                                </span>
                                            }
                                            rightIcon={
                                                <span
                                                    className='icon-text'
                                                    role='img'
                                                    aria-label='right'
                                                    style={{
                                                        fontSize: 'min(50px, 5vw)'
                                                    }}
                                                >
                                                    ▶️
                                                </span>
                                            }

                                        />
                                    </Grid>
                                </>
                                :
                                <>
                                    {/* Image */}
                                    {Extension.Image.indexOf(props.file.sFileType) > -1 && (
                                        <Grid item xs={12} style={{ display: "flex" }}>
                                            {
                                                isCrop ?
                                                    <>
                                                        <Cropper
                                                            src={image}
                                                            id="images"
                                                            zoomTo={0.1945}
                                                            aspectRatio={cropRatio}
                                                            minCropBoxHeight={200}
                                                            minCropBoxWidth={200}
                                                            viewMode={3}
                                                            className={cropShape === "retangle" ? "image-modal" : "image-modal circle-crop"}
                                                            guides={true}
                                                            highlight={true}
                                                            zoomOnTouch={false}
                                                            zoomOnWheel={false}
                                                            cropBoxMovable={cropMovable}
                                                            zoomable={true}
                                                            cropBoxResizable={cropResize}
                                                            responsive={true}
                                                            ref={cropperRef}
                                                        />
                                                    </>
                                                    :
                                                    <>
                                                        <img src={image} alt="" className="image-modal" />
                                                    </>
                                            }
                                        </Grid>

                                    )}
                                    {/* Video */}
                                    {Extension.Video.indexOf(props.file.sFileType) > -1 && (
                                        <Grid item xs={12} >
                                            <div className="player-wrapper">
                                                <ReactPlayer
                                                    ref={playerRef}
                                                    config={{
                                                        file: {
                                                            attributes: { controlsList: "nodownload" },
                                                        },
                                                    }}
                                                    className="react-player"
                                                    url={image}
                                                    width="100%"
                                                    height="100%"
                                                    playing={true}
                                                    controls={true}
                                                    pip={true}
                                                    stopOnUnmount={true}
                                                    onProgress={(playedSeconds) => {
                                                        let nProgress = playedSeconds.playedSeconds || 0;
                                                        if (props.CannotSkipForward) {
                                                            if (nProgress > nPlayedTime) {
                                                                if (nProgress - nPlayedTime < 2) {
                                                                    setPlayedTime(nProgress);
                                                                }
                                                            }
                                                        } else {
                                                            setPlayedTime(nProgress);
                                                        }
                                                    }}
                                                    onReady={onReady}
                                                    onSeek={(nSeekTo) => {
                                                        if (props.CannotSkipForward) {
                                                            if (nSeekTo > nPlayedTime) {
                                                                playerRef.current.seekTo(
                                                                    nPlayedTime,
                                                                    "seconds"
                                                                );
                                                                setIsShowAlert(true);
                                                            }
                                                        }
                                                        if (props.onVideoEnd) {
                                                            props.onVideoEnd(false);
                                                        }
                                                    }}
                                                    onEnded={() => {
                                                        if (props.onVideoEnd) {
                                                            props.onVideoEnd(true);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </Grid>
                                    )}
                                    {/* PDF */}
                                    {/* {(Extension.PDF.indexOf(props.file.sFileType) > -1 || Extension.Word.indexOf(props.file.sFileType) > -1 || Extension.Excel.indexOf(props.file.sFileType) > -1 || Extension.PowerPoint.indexOf(props.file.sFileType) > -1) && ( */}
                                    {Extension.PDF.indexOf(props.file.sFileType) > -1 && (
                                        <>
                                            <Grid item xs={12} >
                                                <DocViewer
                                                    documents={lstDocumentFile}
                                                    pluginRenderers={DocViewerRenderers}
                                                    config={{
                                                        header: {
                                                            disableHeader: false,
                                                            disableFileName: false,
                                                            retainURLParams: false,
                                                        },
                                                        pdfZoom: {
                                                            defaultZoom: 0.8, // 1 as default,
                                                            zoomJump: 0.2, // 0.1 as default,
                                                        },
                                                        pdfVerticalScrollByDefault: true, // false as default
                                                    }}
                                                    theme={{
                                                        primary: "#5296d8",
                                                        secondary: "#ffffff",
                                                        tertiary: "#5296d899",
                                                        textPrimary: "#ffffff",
                                                        textSecondary: "#5296d8",
                                                        textTertiary: "#00000099",
                                                        disableThemeScrollbar: false,
                                                    }}
                                                    style={{ width: "100%", height: "100%" }}
                                                />
                                            </Grid>
                                        </>

                                    )}
                                </>
                        }
                        <Grid item style={{ display: props.IsCrop && Extension.Image.indexOf(props.file.sFileType) > -1 ? "block" : "none" }}>
                            <ButtonGroup
                                disableElevation
                                variant="text"
                                aria-label="Disabled elevation buttons"
                                style={{
                                    borderColor: '#000000'
                                }}
                            >
                                {
                                    !isCrop ?
                                        <Button
                                            startIcon={<CropRoundedIcon style={{ color: '#000000' }} />}
                                            onClick={() => { onSetCrop() }}
                                            style={{ color: '#000000' }}
                                        >
                                            Crop
                                        </Button>
                                        :
                                        <Button
                                            startIcon={<RefreshRoundedIcon style={{ color: '#000000' }} />}
                                            onClick={() => { rotate() }}
                                            style={{ color: '#000000' }}
                                        >
                                            Rotate
                                        </Button>
                                }
                                <Button
                                    startIcon={<DeleteForeverRoundedIcon style={{ color: '#000000' }} />}
                                    onClick={deleteInDialog}
                                    style={{ color: '#000000' }}
                                >
                                    Delete
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </DialogContent>
            </>
        )
    }

    return (
        <div>
            {
                sPopup === "modal" ?
                    <Dialog
                        TransitionComponent={Transition}
                        maxWidth={'md'}
                        disableEscapeKeyDown
                        fullWidth
                        open={IsopenPopUp}
                    >
                        {jsxContentDialogModal()}
                    </Dialog>
                    :
                    <Dialog
                        fullScreen={true}
                        open={IsopenPopUp}
                        className={"body-uploadfile"}
                        disableEscapeKeyDown
                        onClose={onClosePopup}
                    >
                        {jsxContentDialogFullScreen()}
                    </Dialog>
            }

            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={isShowAlert}
                autoHideDuration={3500}
                onClose={onCloseAlert}
            >
                <MuiAlert
                    severity="warning"
                    onClose={onCloseAlert}
                    action={onActionAlert}
                >
                    {"ไม่สามารถกดข้ามวิดีโอไปข้างหน้าได้!"}
                </MuiAlert>
            </Snackbar>
        </div>
    );
}