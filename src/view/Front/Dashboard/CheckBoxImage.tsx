import React from 'react'
import { Grid } from '@mui/material';
import No_BG from "assets/images/NoImage/no-image-available.png";
import { TaskAlt } from '@mui/icons-material';

const CheckBoxImage = (props) => {
    const { lstTMSDGs, arrCheckSDGs, setarrCheckSDGs } = props;

    const onImageError = (e) => {
        e.target.src = No_BG;
    }

    const onClickImage =(id)=>{
        const selectedIndex = arrCheckSDGs.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(arrCheckSDGs, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(arrCheckSDGs.slice(1));
        } else if (selectedIndex === arrCheckSDGs.length - 1) {
            newSelected = newSelected.concat(arrCheckSDGs.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                arrCheckSDGs.slice(0, selectedIndex),
                arrCheckSDGs.slice(selectedIndex + 1),
            );
        }
        setarrCheckSDGs(newSelected);
    }

    return (
        <Grid container spacing={2} justifyContent={"center"} alignItems={"start"}>
            <Grid item xs={12}>
                <Grid container spacing={2} justifyContent={"start"} alignItems={"start"}>
                    {lstTMSDGs && lstTMSDGs.length > 0 &&
                        lstTMSDGs.map((iSDGs) => {
                            return (
                                <Grid item key={iSDGs.value}>
                                    <div onClick={() => { onClickImage(iSDGs.value) }} style={{position:'relative'}}>
                                        {arrCheckSDGs.includes(iSDGs.value) && <TaskAlt className='check-select' />}
                                            <img
                                                src={iSDGs.sPath != null ? process.env.REACT_APP_API_URL + iSDGs.sPath : No_BG}         
                                                // src={iSDGs.sPath != null ? "https://softthaiapp.com/PTT-CRSR-API/" + iSDGs.sPath : No_BG}
                                                alt=""
                                                title={iSDGs.label}
                                                onError={onImageError}
                                                className={`img-DashboardCardSDGAll ${!arrCheckSDGs.includes(iSDGs.value) ? 'img-gray' : ''}`}
                                            />
                                    </div>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Grid>
        </Grid>
    )
}

export default CheckBoxImage
