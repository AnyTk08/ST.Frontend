/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { Checkbox } from "@mui/material";
import FilePopup from "../PopUp/FilePopup";
import { Extension, FnDialog } from "utilities/ST_Function";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { BsFillFileEarmarkWordFill } from "react-icons/bs";
import { SiMicrosoftexcel, SiMicrosoftpowerpoint } from "react-icons/si";
import _ from "lodash";
import { BtnDeleteOnTable } from "components/Button";
import { CircularProgressWithLabelTable, TablePaginationActions } from "../StyleCpnExport";
import i18n from "config/i18nConfig";
import { downloadFile } from "../../UploadFile";

const DisplayTableFile = (props) => {

    const {
        arrFile,
        setarrFile,
        SendCropImage,
        IsopenPopUp,
        setIsopenPopUp,
        disabled,
        IsHiddenUploadBox,
        onDeleteFileInLocation,
        sPopup,
        IsCrop,
        cropShape,
        cropRatio,
        cropResize,
        cropMovable,
    } = props;

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [oItemClick, setoItemClick] = useState({} as any)
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const DialogFn = FnDialog();

    useEffect(() => {
        if (props.arrFile) {
            setarrFile(props.arrFile)
        }
    }, [props.arrFile])

    useEffect(() => {
        if (props.nRowperpageTable) { setRowsPerPage(props.nRowperpageTable) }
    }, [props.nRowperpageTable])

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrFile.length) : 0;

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const ClosePopUp = () => {
        setoItemClick({})
        setIsopenPopUp(false);
    };
    const OpenPopUp = () => {
        setIsopenPopUp(true);
    };
    
    const onDownload = (itemClick) => {
        downloadFile(itemClick.sFileLink, itemClick.sFileName)
    };

    const onClickFile = (itemClick) => {
        setoItemClick(itemClick)
        if(props.onOpenFile)
        {
            props.onOpenFile(itemClick.nFile_ID);
        } 
        let isCheck = Extension.Image.indexOf(itemClick.sFileType) > -1 || Extension.Video.indexOf(itemClick.sFileType) > -1
        isCheck ? OpenPopUp() : onDownload(itemClick)
    };

    const onHandleDelete = () => {

        DialogFn.Submit(
            i18n.t("msgConfirmSave")
            , () => {
                DialogFn.Success(i18n.t('msgSaveComplete'));
                DialogFn.CloseSubmit()
                DialogFn.UnBlockUI();
                let arrNew = _.filter(arrFile, (item) => {
                    return !selected.includes(item.nFile_ID);
                });
                //Delete File un-used
                selected.forEach(nFile_ID => {
                    onDeleteFileInLocation(nFile_ID)
                });
                setarrFile(arrNew);
            }
        )
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = arrFile.map((n) => n.nFile_ID);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (nFile_ID: string) => {
        const selectedIndex = selected.indexOf(nFile_ID);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, nFile_ID);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const isSelected = (nFile_ID: string) => selected.indexOf(nFile_ID) !== -1;


    return (
        <>
            <Grid container justifyContent="flex-start" alignItems="center">
                <Grid item xs={12}>
                    <TableContainer component={Paper} elevation={1} style={{ borderRadius: '16px' }}>
                        <Table sx={{ minWidth: 500 }}>
                            <TableHead>
                                <TableRow style={{ background: "linear-gradient(135deg,#3a8ffe 0,#9658fe 100%)" }}>
                                    <StyledTableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            indeterminate={selected.length > 0 && selected.length < arrFile.length}
                                            checked={arrFile.length > 0 && selected.length === arrFile.length}
                                            onChange={handleSelectAllClick}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '5%', padding: '12px 16px' }}>No</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '10%', padding: '12px 16px' }}></StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '70%', padding: '12px 16px' }}>File name</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '10%', padding: '12px 16px' }}>Progress</StyledTableCell>
                                    <StyledTableCell align="center" style={{ width: '5%', padding: '12px 16px' }}></StyledTableCell>
                                </TableRow>
                            </TableHead>
                            {
                                arrFile.length > 0 ?
                                    <TableBody>
                                        {(rowsPerPage > 0
                                            ? arrFile.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : arrFile
                                        ).map((row, index) => {
                                            let nNo = (page * rowsPerPage) + (index + 1);
                                            const isItemSelected = isSelected(row.nFile_ID);

                                            return (
                                                <TableRow key={nNo}>
                                                    <StyledTableCell padding="checkbox">
                                                        {
                                                            row.IsCompleted && !disabled && !IsHiddenUploadBox ?
                                                                <Checkbox
                                                                    color="primary"
                                                                    checked={isItemSelected}
                                                                    onClick={(event) => { handleClick(row.nFile_ID) }}
                                                                />
                                                                :
                                                                null
                                                        }
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center" component="th" scope="row" style={{ padding: '4px 16px' }}>
                                                        {nNo}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center" component="th" scope="row" style={{ padding: '4px 16px' }}>
                                                        <>
                                                            {Extension.Image.indexOf(row.sFileType) > -1 ?
                                                                <Fragment>
                                                                    <img
                                                                        src={row.sCropFileLink.search("http") > -1 ? row.sCropFileLink : process.env.REACT_APP_API_URL + row.sCropFileLink || ""}
                                                                        alt=""
                                                                        width={30}
                                                                        height={30}
                                                                        className="img-shadow"
                                                                        style={{ borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }}
                                                                        onClick={() => { onClickFile(row) }}
                                                                    />
                                                                </Fragment>
                                                                : null}
                                                            {Extension.Video.indexOf(row.sFileType) > -1 ?
                                                                <IconButton
                                                                    className={"mui-style-WordColor"}
                                                                    size="small"
                                                                    onClick={() => { onClickFile(row) }}
                                                                >
                                                                    <VideoLibraryIcon className={"mui-style-IConColor"} />
                                                                </IconButton>
                                                                : null}

                                                            {Extension.PDF.indexOf(row.sFileType) > -1 ?
                                                                <IconButton
                                                                    className={"mui-style-PDFColor"}
                                                                    size="small"
                                                                    onClick={() => { onClickFile(row) }}
                                                                >
                                                                    <PictureAsPdfIcon className={"mui-style-IConColor"} />
                                                                </IconButton>
                                                                : null
                                                            }

                                                            {Extension.Word.indexOf(row.sFileType) > -1 ?
                                                                <IconButton
                                                                    className={"mui-style-WordColor"}
                                                                    size="small"
                                                                    onClick={() => { onClickFile(row) }}
                                                                >
                                                                    <BsFillFileEarmarkWordFill className={"mui-style-IConColor"} />
                                                                </IconButton>
                                                                : null}

                                                            {Extension.Excel.indexOf(row.sFileType) > -1 ?
                                                                <IconButton
                                                                    className={"mui-style-ExcelColor"}
                                                                    size="small"
                                                                    onClick={() => { onClickFile(row) }}
                                                                >
                                                                    <SiMicrosoftexcel className={"mui-style-IConColor"} />
                                                                </IconButton>
                                                                : null}

                                                            {Extension.PowerPoint.indexOf(row.sFileType) > -1 ?
                                                                <IconButton
                                                                    className={"mui-style-PowerPointColor"}
                                                                    size="small"
                                                                    onClick={() => { onClickFile(row) }}
                                                                >
                                                                    <SiMicrosoftpowerpoint className={"mui-style-IConColor"} />
                                                                </IconButton>
                                                                : null}

                                                        </>
                                                    </StyledTableCell>
                                                    <StyledTableCell className="underline-on-hover" align="left" onClick={() => { onClickFile(row) }} style={{ padding: '4px 16px' }}>
                                                        {row.sFileName}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center" style={{ padding: '4px 16px' }}>
                                                        {
                                                            parseInt(row.sProgress) === 100 ?
                                                                <>
                                                                    <CheckCircleIcon className="icon-pass" />
                                                                </>
                                                                :
                                                                <CircularProgressWithLabelTable value={parseInt(row.sProgress) || 0} />
                                                        }
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left" style={{ padding: '4px 16px' }}>
                                                    </StyledTableCell>
                                                </TableRow>
                                            )
                                        })}
                                        {emptyRows > 0 && (
                                            <TableRow style={{ height: 36.8 * emptyRows }}>
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                    :
                                    <StyledTableRow key={"r-no-data"} >
                                        <StyledTableCell align="center" colSpan={5}>ไม่พบข้อมูล</StyledTableCell>
                                    </StyledTableRow>
                            }
                            {
                                arrFile.length > 0 ?
                                    <TableFooter style={{ height: '37px' }}>
                                        <StyledTableRow>
                                            {
                                                selected.length > 0 ?
                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '52px' }}>
                                                        <BtnDeleteOnTable id={"delete-ontable"} txt="ลบ" onClick={onHandleDelete} />
                                                    </div>
                                                    : null
                                            }
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                colSpan={6}
                                                count={arrFile.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                                ActionsComponent={TablePaginationActions}
                                            />
                                        </StyledTableRow>
                                    </TableFooter>
                                    :
                                    null
                            }
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <FilePopup
                file={{
                    sFileType: oItemClick.sFileType,
                    sFileLink: oItemClick.sFileLink,
                    sFileName: oItemClick.sFileName,
                    sCropFileLink: oItemClick.sCropFileLink,
                    sCropPath: oItemClick.sCropPath,
                    sUrl: oItemClick.sUrl,
                    nFile_ID: oItemClick.nFile_ID,
                }}
                IsCrop={IsCrop}
                cropShape={cropShape}
                cropRatio={cropRatio}
                cropResize={cropResize}
                cropMovable={cropMovable}
                IsopenPopUp={IsopenPopUp}
                ClosePopUp={ClosePopUp}
                SendCropImage={SendCropImage}
                setStartVideoOn={props.setStartVideoOn}
                nStartVideoOn={props.nStartVideoOn}
                CannotSkipForward={props.CannotSkipForward}
                onVideoEnd={props.onVideoEnd}
                onDelete={props.onDelete}
                sPopup={sPopup}
            />
        </>
    );
};


export default DisplayTableFile;


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
