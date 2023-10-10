/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import {
    Avatar,
    Typography,
    Drawer, 
    Grid
} from "@mui/material";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import ListHeadMenu from "./components/Menu/ListHeadMenu";
import AppbarBack from "./components/AppbarBack";
import BreadcrumbAuto from "components/Breadcrumbs/BreadcrumbAuto";
import { AxiosGet } from "utilities/ST_Axios";
import { IlstMenu } from "layout/ILayout";


type Props = {
    children?: React.ReactNode;
};

const LayoutBack: React.FC<Props> = ({ children }) => {

    const [sidebar] = React.useState(false);
    const [dataMenu, setDataMenu] = useState<IlstMenu[]>([]);

    useEffect(() => {
        GetMenuSystem()
    }, [])

    const GetMenuSystem = () => {
        AxiosGet('APISystems/GetMenuSystem', { IsFront: false }, (Result) => {
            setDataMenu(Result.lstMenu ?? [])
        });
    };

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '100vh', position: 'relative' }}>
            <AppbarBack dataMenu={dataMenu} />
            <Box sx={{ display: 'flex' }}>
                <Drawer
                    variant="permanent"
                    style={{
                        transition: 'width 0.2s ease',
                    }}
                    className="display-hide-mb"
                    sx={{
                        width: 245,
                        zIndex: 1000,
                        flexShrink: 0,
                        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                          [`& .MuiDrawer-paper`]: { width: 245, boxSizing: 'border-box' },
                    }}
                    >
                    <Toolbar style={{ minHeight: '70px' }} />
                    <div style={{ width: '100%', padding: '1.4em 1em', display: 'flex', boxShadow: '0px 7px 7px -7px #888888' }}>
                        <Grid container direction={'column'} spacing={1} justifyContent={'space-evenly'} alignItems='center'>
                            <Grid item xs={'auto'}>
                                <Avatar src={""} style={{ width: '5em', height: '5em' }} />
                            </Grid>
                            <Grid item xs={'auto'}>
                                <Typography className="text-center color-blue font-medium">SomChai Tongpan</Typography>
                                <Typography className="text-center">Administrator</Typography>
                                <Typography className="text-center">กสญ.</Typography>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="color-back" style={{ width: '100%', padding: '0.5em' }}>
                        <Typography className="text-center font-semibold">เมนู Administator</Typography>
                    </div>
                    <Box sx={{ overflowY: 'auto', padding: "10px 0" }}>
                        <ListHeadMenu
                            dataMenu={dataMenu}
                            sidebar={sidebar}
                            setIsDrawerMenu={false}
                        />
                    </Box>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        minHeight: '100vh',
                        height: '100%',
                        width: '100%',
                        marginTop: '8px'
                    }}
                >
                    <Toolbar style={{ minHeight: '70px' }} />
                    <Grid container justifyContent={'center'} alignItems={'start'} >
                        <Grid item xs={12} style={{ margin: "6px 12px" }}>
                            <BreadcrumbAuto />
                        </Grid>
                        <Grid item xs={12}>
                            <div style={{ padding: "0 2em" }}>
                                {children}
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </div>
    );
};
export default LayoutBack;

