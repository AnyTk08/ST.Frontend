import React, { Fragment, useEffect, useState } from 'react'
import { Grid, Skeleton, Typography } from '@mui/material'
import { ArrowForward } from '@mui/icons-material';
import { FnDialog } from 'utilities/ST_Function';
import { useNavigate } from 'react-router-dom';
import No_BG from "assets/images/NoImage/no-image-available.png";
import { GetHomeSDG } from './CallAPI';
import i18n from 'config/i18nConfig'
import './cardSDG.css'

const CardSDG = () => {
    const navigate = useNavigate();
    const DialogFn = FnDialog();
    const [IsSkelton, setIsSkelton] = useState(true)
    const [lstDataSDG, setlstDataSDG] = useState<any>([]);

    const loadData = async () => {
        DialogFn.BlockUI()
        GetHomeSDG({}, (res) => {
            DialogFn.UnBlockUI();
            setlstDataSDG(res.lstDataSDG);
            setIsSkelton(false)
        }, (err) => {
            if (!err.response) {
                DialogFn.Warning(err.Message);
            }
        });
    }
    useEffect(() => {
        loadData()
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
    const OnPageAll = () => {
        navigate(`/homebanner-card-sdg-all`);
    };
    const onImageError = (e) => {
        e.target.src = No_BG
    }
    return (
        <Fragment>
            <div className='Container-SDG' >
                <Grid container spacing={3} justifyContent={"flex-start"}>
                    {
                        (IsSkelton ? Array.from(new Array(6)) : lstDataSDG).map((item, index) => {
                            return (
                                <>
                                    {
                                        item ? (
                                            <Grid item md={4} sm={4} xs={6} key={`sdg_${item.sSDGID}`} display={"flex"} justifyContent={"center"}>
                                                <div className='box-cardSDG' id={`sSDGID_${item.sSDGID}`} onClick={() => { OnPage(item.sSDGID) }}>
                                                    <div>
                                                        <img
                                                            className='img-cardSDG'
                                                            src={item.sFile ? item.sFile : No_BG}
                                                            onError={onImageError}
                                                        />
                                                    </div>
                                                    <div className='cardSDG-Content1'>
                                                        <Typography className='ct1-text' variant="body1" >{`${i18n.t("HomeSDGs.nSumProject")}`}</Typography>
                                                        <Typography className='ct1-num' variant="body1" >{item.nSumProject}</Typography>
                                                    </div>
                                                    <div className="cardSDG-Content2">
                                                        <Typography className='ct2-txt2' variant="body1" >{`${i18n.t("HomeSDGs.sBudget")}`}</Typography>
                                                        <Typography className='ct2-txt1' variant="body1" >{item.sSumBudget}</Typography>
                                                    </div>
                                                </div>
                                            </Grid>
                                        )
                                            : (<Grid item md={4} sm={4} xs={6} key={`skeleton_${index + ""}`} display={"flex"} justifyContent={"center"}>
                                                <div style={{ height: "220px", width: "100%" }}>
                                                    <Skeleton variant="rectangular" animation="wave" height={"110px"} width={"100%"} />
                                                    <Skeleton animation="wave" height={"40px"} width={"100%"} />
                                                    <Skeleton animation="wave" height={"60px"} width={"100%"} />
                                                </div>
                                            </Grid>)
                                    }
                                </>
                            )
                        })
                    }

                </Grid>
                <div className='con-btn-more'>
                    {lstDataSDG.length > 0 &&
                        <Grid item xs={12}>
                            <div id='BtnMore' className='Btn-More' onClick={() => { OnPageAll() }}>
                                <Typography className='container-btn-more'> <ArrowForward className='btn-icon-more' /> <span>{`${i18n.t("HomeSDGs.btnMore")}`}</span> </Typography>
                            </div>
                        </Grid>
                    }
                </div>
            </div>
        </Fragment>
    )
}

export default CardSDG
