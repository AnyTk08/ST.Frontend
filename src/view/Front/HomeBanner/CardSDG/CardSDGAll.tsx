import React, { Fragment, useEffect, useState } from 'react'
import { Grid, Skeleton, Typography, useMediaQuery } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import No_BG from "assets/images/NoImage/no-image-available.png";
import { FnDialog } from 'utilities/ST_Function';
import i18n from 'config/i18nConfig'
import { GetHomeSDGAll } from './CallAPI';
import './cardSDG.css'
const CardSDGAll = () => {
    const navigate = useNavigate();
    const DialogFn = FnDialog();
    const [isSkeleton, setisSkeleton] = useState(true)
    const [lstAllData, setlstAllData] = useState<any>([]);
    const Layout425 = useMediaQuery('(min-width:425px)');
    const Layout900 = useMediaQuery('(min-width:900px)');
    const loadData = async () => {
        DialogFn.BlockUI();
        GetHomeSDGAll({}, (res) => {
            DialogFn.UnBlockUI();
            setlstAllData(res.lstDataSDG);
            setisSkeleton(false);
        }, (err) => {
            if (!err.response) {
                DialogFn.Warning(err.Message);
            }
        });
    }
    useEffect(() => {
        loadData();
    }, []);
    const OnPage = (sSDGID) => {
        if (sSDGID !== "") {
            navigate(`/homebanner-sdg-list`,
                {
                    state: {
                        sSDGID: sSDGID
                    }
                }
            )
        }
        else {
            navigate(`/homebanner-sdg-list`)
        }
    }
    const onImageError = (e) => {
        e.target.src = No_BG
    }
    return (
        <Fragment>
            <Grid container spacing={3} direction="row" justifyContent="start" alignItems="center" padding={"0 3rem"}>
                <Grid container marginTop={"1rem"} spacing={3}>
                    {
                        (isSkeleton ? Array.from(new Array(Layout900 ? 9 : (Layout425 ? 6 : 3))) : lstAllData).map((item, index) => {
                            return (
                                <>
                                    {
                                        item ? (
                                            <Grid item md={4} sm={6} xs={12} key={item.sSDGID} className='grid-card-sdgall'>
                                                <div className='box-card-SDGall'>
                                                    <div className="content-top-cardSDG-All" id={`sSDGIDAll_${item.sSDGID}`} onClick={() => { OnPage(item.sSDGID) }}>
                                                        <img
                                                            className='img-cardSDG-All'
                                                            src={item.sFile ? item.sFile : No_BG}
                                                            onError={onImageError}
                                                        />
                                                        <div className='ct-top-cardSDG-All'>
                                                            <Typography className='ct-top-t1' variant="body1">{item.sSDGName}</Typography>
                                                        </div>
                                                        <div className='ct2-top-cardSDG-All'>
                                                            <Typography className='ct2-top-t1' variant="body1">{item.nSumProject}</Typography>
                                                            <Typography className='ct2-top-t2' variant="body1">{`${i18n.t("HomeSDGs.sProject")}`}</Typography>
                                                        </div>
                                                    </div>
                                                    <div className="content-bottom-cardSDG-All" >
                                                        <Typography className='ct-bt-t1' variant="body1" >{`${i18n.t("HomeSDGs.sBudget")}`}</Typography>
                                                        <Typography className='ct-bt-t2' variant="body1" >{item.sSumBudget}</Typography>
                                                        <Typography className='ct-bt-t3' variant="body1" >{`${i18n.t("HomeSDGs.bath")}`}</Typography>
                                                    </div>
                                                </div>
                                            </Grid>
                                        ) : (<Grid item md={4} sm={4} xs={6} key={`${index + ""}`} display={"flex"} justifyContent={"center"}>
                                            <div style={{ height: "220px", width: "100%" }}>
                                                <Skeleton variant="rectangular" animation="wave" height={"95px"} width={"100%"} />
                                                <Skeleton animation="wave" height={"55px"} width={"100%"} />
                                            </div>
                                        </Grid>)
                                    }
                                </>
                            )
                        })
                    }
                </Grid>
            </Grid>
        </Fragment>
    )
}

export default CardSDGAll
