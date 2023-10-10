import { CircularProgress, Grid, useMediaQuery } from '@mui/material'
import { useMemo, useState } from 'react'
import { FaCircle } from "react-icons/fa";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { BtnViewDataOnTable } from 'components/Button';
import { TypeModeBtn } from 'components/enum/enumSystem';
import { useNavigate } from 'react-router-dom';
import CustomTablePagination from 'view/Front/Graph/components/CustomTablePagination';

const MornitorStatus = (props) => {

  const { dataRow, arrRound, LoadingTable } = props;

  const navigate = useNavigate();


  const matches900 = useMediaQuery('(min-width:900px)');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const lstData = useMemo(() => {
    if (LoadingTable) {
      return [];
    }
    return dataRow.arrRows ?? [];
  }, [LoadingTable, dataRow.arrRows])

  const goToDetailProject = (nProjectID, sModeBtn, nAreaID, nRequestTypeID) => {
    if (nProjectID) {
      navigate(`/project-report`,
        {
          state:
          {
            nProjectID: nProjectID,
            nAreaID: nAreaID,
            sModeBtn: TypeModeBtn.ViewProject,
            nRequestTypeID: nRequestTypeID,
          }
        }
      );
    }

  };

  return (
    <Grid container spacing={1} >
      <Grid item xs={12}>
        <Grid container spacing={matches900 ? 1 : 0} direction="row" justifyContent="end" alignItems="center">
          <Grid item xs={12} sm={6} md={'auto'} style={{ display: 'flex', alignItems: 'center' }}>
            <FaCircle style={{ fontSize: '0.7em', color: '#02830f' }} />&nbsp;&nbsp;<span className='text-sm'>Succeeded</span>
          </Grid>
          <Grid item xs={12} sm={6} md={'auto'} style={{ display: 'flex', alignItems: 'center' }}>
            <FaCircle style={{ fontSize: '0.7em', color: '#ffd51b' }} />&nbsp;&nbsp;<span className='text-sm'>Waiting for Update</span></Grid>
          <Grid item xs={12} sm={6} md={'auto'} style={{ display: 'flex', alignItems: 'center' }}>
            <FaCircle style={{ fontSize: '0.7em', color: '#d7d7d7' }} />&nbsp;&nbsp;<span className='text-sm'>Waiting for Approval</span>
          </Grid>
          <Grid item xs={12} sm={6} md={'auto'} style={{ display: 'flex', alignItems: 'center' }}>
            <FaCircle style={{ fontSize: '0.7em', color: '#d9001b' }} />&nbsp;&nbsp;<span className='text-sm'>Delayed</span>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TableContainer id='table-status' component={Paper} style={{ display: 'inline-grid' }}>
          <Table size={'small'} sx={{ minWidth: 200 }} >
            <TableHead>
              <TableRow>
                <TableCell align="center" rowSpan={2} style={{ minWidth: '40px', width: '40px' }}></TableCell>
                <TableCell align="center" rowSpan={2} style={{ minWidth: '40px', width: '40px' }}>ที่</TableCell>
                <TableCell align="center" rowSpan={2} style={{ minWidth: '220px', width: '220px' }}>ชื่อโครงการ</TableCell>
                <TableCell align="center" rowSpan={2} style={{ minWidth: '150px', width: '150px' }}>พื้นที่ดำเนินการ</TableCell>
                <TableCell align="center" rowSpan={2} style={{ minWidth: '70px', width: '70px' }}>หน่วยงานรับผิดชอบ</TableCell>
                <TableCell align="center" rowSpan={2} style={{ minWidth: '70px', width: '70px' }}>แก้ไขล่าสุด</TableCell>
                <TableCell align="center" colSpan={arrRound.length === 0 ? 2 : arrRound.length} style={{ minWidth: '200px' }}>Update Progress</TableCell>
              </TableRow>
              <TableRow>
                {
                  arrRound != null && arrRound.length > 0 ?
                    <>
                      {
                        arrRound.map((item, index) => {
                          return (
                            <TableCell
                              key={item.sID}
                              component="th"
                              padding='none'
                              style={{
                                minWidth: '50px',
                                width: '50px'
                              }}
                            >
                              {item.label}
                            </TableCell>
                          )
                        })
                      }
                    </>
                    :
                    null
                }
              </TableRow>
            </TableHead>
            {
              lstData.length > 0 ?
                <TableBody>
                  {(rowsPerPage > 0
                    ? lstData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : lstData
                  ).map((row, index) => {
                    let nNo = (page * rowsPerPage) + (index + 1);
                    let lstRound = row.lstRound ?? [];
                    return (
                      <TableRow key={nNo}>
                        <TableCell align="center" style={{ textAlign: 'center',minHeight:'43px' }}>
                          {
                            row.IsView ?
                            <BtnViewDataOnTable
                              id={"btnview-" + row.sID}
                              onClick={() => goToDetailProject(row.nProjectID, TypeModeBtn.ViewProject, row.nAreaID, 1)}
                            />
                            : 
                            <div style={{height:'34px'}}></div>
                          }
                        </TableCell>
                        <TableCell align="center" style={{ textAlign: 'center' }}>
                          {nNo}.
                        </TableCell>
                        <TableCell align="center" >
                          {row.sNameProject}
                        </TableCell>
                        <TableCell align="center" >
                          {row.sArea}
                        </TableCell>
                        <TableCell align="center" style={{ textAlign: 'center' }}>
                          {row.sUnitname}
                        </TableCell>
                        <TableCell align="center" style={{ textAlign: 'center' }}>
                          {row.sUpdateDate}
                        </TableCell>
                        {
                          lstRound.map(rowRound => {
                            let sKey = row.sID + rowRound.sRound;
                            return (
                              <TableCell key={sKey} align="center" style={{ textAlign: 'center' }}>
                                {rowRound.sStatusID === "-1" ? <FaCircle style={{ fontSize: '0.7em', margin: 'auto', color: '#d9001b' }} /> : null}
                                {rowRound.sStatusID === "0" ? <FaCircle style={{ fontSize: '0.7em', margin: 'auto', color: '#ffd51b' }} /> : null}
                                {rowRound.sStatusID === "1" ? <FaCircle style={{ fontSize: '0.7em', margin: 'auto', color: '#d7d7d7' }} /> : null}
                                {rowRound.sStatusID === "7" ? <FaCircle style={{ fontSize: '0.7em', margin: 'auto', color: '#02830f' }} /> : null}
                              </TableCell>
                            )
                          })
                        }
                      </TableRow>
                    )
                  })}
                </TableBody>
                :
                <TableRow key={"r-no-data"} >
                  {
                    LoadingTable ?
                      <TableCell colSpan={10} style={{ textAlign: 'center' }}>
                        <CircularProgress />
                      </TableCell>
                      :
                      <TableCell colSpan={10} style={{ textAlign: 'center' }}>ไม่พบข้อมูล</TableCell>

                  }
                </TableRow>
            }
            <CustomTablePagination
              dataTable={lstData}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              page={page}
              setPage={setPage}
              colSpan={10}
            />
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default MornitorStatus
