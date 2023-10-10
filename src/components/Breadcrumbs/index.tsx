import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import { BreadcrumbUIProp } from './BreadcrumbsBar'
import "./Breadcrumbs.css"

const BreadcrumbsBar = (props: BreadcrumbUIProp) => {
    const navigate = useNavigate();
    return (
        <div className='Divbreadcrumb' >
            <Breadcrumbs maxItems={4} aria-label="breadcrumb" style={{ color: "#fff" }}>
                <Link underline="hover" color="inherit" sx={{ cursor: "pointer" }} onClick={() => { let url = "/"; navigate(url) }}>หน้าหลัก </Link>
                {props.Item.map((m, i) => (
                        m.IsOnClick ?
                            (
                                <Link underline="hover" color="inherit" sx={{ cursor: "pointer" }} onClick={() => { }} key={`BreadcrumbAuto_${m.Key}`}>{m.ItemName}</Link>
                            )
                            :
                            (
                                <Typography color={i == (props.Item.length - 1) ? "#72aed3" : "#d2d2d2"} key={`BreadcrumbAuto_${m.Key}`}>{m.ItemName}</Typography>
                            )
                    ))
                }
            </Breadcrumbs>
        </div>
    )
}
export default BreadcrumbsBar;

