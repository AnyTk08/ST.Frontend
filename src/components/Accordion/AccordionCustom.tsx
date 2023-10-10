import { useState } from "react";
import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { AccordionSummary } from "@mui/material";

const AccordionStyled = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} {...props} />
))(() => ({
    // border: `1px solid ${theme.palette.divider}`,
    border: "1px solid #7eaef787",
    borderRadius: '9px !important',
    // '&:not(:last-child)': {
    //     borderBottom: 0,
    // },
    // '&:before': {
    //     display: 'none',
    // },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
}));

interface props {
    children: React.ReactNode,
    header?: string,
    color?: string,
    bgColor?: string,
    borderColor?: string
}


const AccordionCustom: React.FC<props> = ({ children, header, color, bgColor, borderColor }) => {
    const [expanded, setExpanded] = useState(true);

    const handleChange = () => {
        setExpanded(!expanded);
    };

    return (
        <AccordionStyled expanded={expanded} sx={{border: borderColor }}>
            <AccordionSummary
                onClick={() => { handleChange() }}
                expandIcon={<ArrowDropDownIcon style={{ fontSize: '2.5rem', color: color ?? "#3E97FF" }} />}
                sx={{
                    // color: "#ffffff",
                    // backgroundColor: "#7eaef7",
                    color: color ?? "#3E97FF",
                    backgroundColor: bgColor ?? "#EEF6FF",
                    cursor: 'pointer',
                    borderRadius: "8px",
                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                        transform: 'rotate(180deg)',
                    },
                    '& .MuiAccordionSummary-content': {
                        marginLeft: '8px',
                    },
                    alignItems: "center",
                    '& .MuiAccordionSummary-expandIconWrapper': {
                        margin: "0"
                    }
                }}

            >
                <Typography className="font-medium">{header}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </AccordionStyled>
    )
}

export default AccordionCustom