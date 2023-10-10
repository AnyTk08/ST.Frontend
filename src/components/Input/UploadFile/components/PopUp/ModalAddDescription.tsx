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
import { TextBoxNoForm } from 'components/Input/TextBox';
import {  BtnConfirm } from 'components/Button';
import DescriptionIcon from '@mui/icons-material/Description';


export default function ModalAddDescription(props) {

    const { IsOpen, setIsOpen,sFileName,dtRow } = props;

    const [sValue, setsValue] = React.useState(props.sDescription ?? "")


    const onAddDescription = () => {
        dtRow.sDescription = sValue;
        setIsOpen(false);
    }

    return (
        <BootstrapDialog
            onClose={() => { setIsOpen(false); }}
            TransitionComponent={Transition}
            open={IsOpen}
            maxWidth={'sm'}
            fullWidth
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={() => { setIsOpen(false); }}>
                <Typography variant="h6" style={{ margin: 0 }}>
                <DescriptionIcon/>{" "}<b>เพิ่มคำบรรยาย</b>
                </Typography>
            </BootstrapDialogTitle>
            <DialogContent dividers>
                <Grid container justifyContent="flex-end" alignItems="center">
                    <Grid item xs={12}>
                        <Typography>
                            <b>ชื่อไฟล์ : </b>{sFileName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextBoxNoForm
                            id='sDescription'
                            name='sDescription'
                            label='คำบรรยาย'
                            maxLength={200}
                            value={sValue}
                            onChange={(e) => {
                                console.log("Evalue", e);
                                setsValue(e)
                            }}
                            IsShrink={true}
                            placeholder='คำบรรยาย'
                            multiline
                            rows={4}
                        />
                    </Grid>
                    <Grid item >
                        <BtnConfirm id='confirm-description' onClick={() => { onAddDescription() }} />
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
                        p: 0,
                        color: "#ffffff",
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};
