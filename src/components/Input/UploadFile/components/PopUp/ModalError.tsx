import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import Grid from "@mui/material/Grid";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { TablePaginationActions } from '../StyleCpnExport';
import i18n from 'config/i18nConfig';

export default function ModalError(props) {

    const [arrFile, setarrFile] = React.useState([] as any)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    React.useEffect(() => {
        if (props.arrDataError) { setarrFile(props.arrDataError) }
        if (props.open) { setPage(0) }
        if (props.nRowperpageTable) { setRowsPerPage(props.nRowperpageTable) }
    }, [props])


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

    return (
        <BootstrapDialog
            onClose={() => { props.setOpen(false); }}
            TransitionComponent={Transition}
            open={props.open}
            maxWidth={'md'}
            fullWidth
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={() => { props.setOpen(false); }}>
                <Typography variant="h6" style={{margin:0}}>
                   <b> {i18n.t("uploadfile.ListFileFail")}</b>
                </Typography>
            </BootstrapDialogTitle>
            <DialogContent dividers>
                <Grid container justifyContent="flex-start" alignItems="center">
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 500 }}>
                                <TableHead>
                                    <TableRow style={{background:"linear-gradient(135deg,#3a8ffe 0,#9658fe 100%)"}}>
                                        <StyledTableCell align="center" style={{ width: '5%', padding: '12px 16px' }}>{i18n.t("uploadfile.No")}</StyledTableCell>
                                        <StyledTableCell align="center" style={{ width: '45%', padding: '12px 16px' }}>{i18n.t("uploadfile.FileName")}</StyledTableCell>
                                        <StyledTableCell align="center" style={{ width: '50%', padding: '12px 16px' }}>{i18n.t("uploadfile.Cause")}</StyledTableCell>
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
                                                return (
                                                    <TableRow key={nNo}>
                                                        <StyledTableCell align="center" component="th" scope="row" style={{ padding: '4px 16px' }}>
                                                            {nNo}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left" style={{ padding: '4px 16px' }}>
                                                            {row.sFileName}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left" style={{ padding: '4px 16px' }}>
                                                            {row.Cause}
                                                        </StyledTableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                        :
                                        <StyledTableRow key={"r-no-data"} >
                                            <StyledTableCell align="center" colSpan={4}>ไม่พบข้อมูล</StyledTableCell>
                                        </StyledTableRow>
                                }
                                {
                                    arrFile.length > 0 ?
                                        <TableFooter style={{ height: '37px' }}>
                                            <StyledTableRow>
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                    colSpan={4}
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
            </DialogContent>
        </BootstrapDialog>
    );
}


export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, py: 1,backgroundColor: "#5197ff", color: "#ffffff"  }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        p:0,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

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



