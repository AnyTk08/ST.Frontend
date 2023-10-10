import { Grid, Skeleton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import GraphBudget from './components/GraphBudget'
import GraphSDGs from './components/GraphSDGs'
import GraphResult from './components/GraphResult'
import { AxiosGet } from 'utilities/ST_Axios'
import './graph.css';

const PageGraph = () => {

    const [arrMenuShow, setarrMenuShow] = useState([] as any)
    const [IsSkelton, setIsSkelton] = useState(true)

    const [arrOption, setarrOption] = useState({
        year: [],
        yearBudget: [],
        sdg: [],
        agengy: [],
        indicator: [],
        project: [],
        arryearResult: []
    })
    useEffect(() => {
        getPermissionGraph();
        getInitOption();
    }, [])

    const getInitOption = () => {
        AxiosGet('Graph/GetInitOptionGraph', null, (result) => {
            setarrOption({
                year: result.lstYear ?? [],
                yearBudget: result.lstYearBudget ?? [],
                sdg: result.lstSDGs ?? [],
                agengy: result.lstAgency ?? [],
                indicator: result.lstIndicator ?? [],
                project: result.lstProject ?? [],
                arryearResult: result.arrYearResult ?? [],
            })
            setIsSkelton(false)
        });
    };

    const getPermissionGraph = () => {
        AxiosGet('Graph/GetPermissionGraph', null, (result) => {
            setarrMenuShow(result.lstGraphShowMenuID ?? [])
        });
    };

    return (
        <Grid container spacing={2} justifyContent={"center"}>
            {arrMenuShow.includes(46) &&
                <Grid item xs={12} >
                    {IsSkelton ?
                        <Skeleton animation="wave" height={300} />
                        :
                        <GraphBudget arrOption={arrOption} />
                    }
                </Grid>
            }
            {arrMenuShow.includes(47) &&
                <Grid item xs={12} >
                    {IsSkelton ?
                        <Skeleton animation="wave" height={300} />
                        :
                        <GraphSDGs arrOption={arrOption} />
                    }
                </Grid>
            }
            {arrMenuShow.includes(48) &&
                <Grid item xs={12} >
                    {IsSkelton ?
                        <Skeleton animation="wave" height={300} />
                        :
                        <GraphResult arrOption={arrOption} />
                    }
                </Grid>
            }
            {
                arrMenuShow.length === 0 &&
                <Grid item xs={12} style={{textAlign:'center'}}>
                    ไม่พบข้อมูล
                </Grid>
            }
            {/* <Grid item xs={12} > <GraphBudget arrOption={arrOption} /> </Grid> */}
            {/* <Grid item xs={12} ><GraphSDGs arrOption={arrOption} /> </Grid> */}
            {/* <Grid item xs={12} > <GraphResult arrOption={arrOption} /> </Grid> */}
        </Grid>
    )
}

export default PageGraph

export function createColumn(
    field: string,
    headerName: string = "",
    sortable: boolean = false,
    headerAlign: "center" | "left" | "right" = "center",
    flex: number = 1,
    minWidth: number = 100,
    renderCell: (item: any) => JSX.Element = (item) => {
        return (
            <>
                {item.value}
            </>
        );
    },
    align: "center" | "left" | "right" = "left",
) {
    return { field, headerName, headerAlign, sortable, flex, minWidth, renderCell, align };
}