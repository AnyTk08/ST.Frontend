import React, { Fragment, useMemo } from 'react'
import { Grid, MenuItem, Pagination, Select, TableFooter, TablePagination, TableRow, Typography } from '@mui/material';
const CustomTablePagination = (props) => {

    const { dataTable, rowsPerPage, page, setPage, setRowsPerPage, colSpan } = props;

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
        <Fragment>
            {
                dataTable.length > 0 ?
                    <TableFooter style={{ height: '37px' }}>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[]}
                                colSpan={colSpan}
                                count={dataTable.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={(props) => <CustomTablePaginationActions {...props} handleChangeRowsPerPage={handleChangeRowsPerPage} />}
                                labelDisplayedRows={({ from, to, count }) => ``}
                                labelRowsPerPage={""}
                                SelectProps={{
                                    hidden: true,
                                    className: "none-display",
                                    inputProps: {
                                        "aria-label": "page number"
                                    }
                                }}
                            />
                        </TableRow>
                    </TableFooter>
                    :
                    null
            }
        </Fragment>
    )
}

export default CustomTablePagination

export function CustomTablePaginationActions(props) {
    const { count, page, rowsPerPage, onPageChange, handleChangeRowsPerPage } = props;

    const handleChangePage = (event, newPage: number) => {
        onPageChange(event, newPage - 1);
    };

    const lstJump = useMemo(() => {
        let nAllPage = Math.ceil(count / rowsPerPage);
        let lstPageData = [];
        for (let i = 0; i < nAllPage; i++) {
            lstPageData.push({ label: i + 1, value: i + 1 });
        }
        return lstPageData;
    }, [count, rowsPerPage])

    const TextTotal = useMemo(() => {
        let end = (page + 1) * rowsPerPage;
        let sText = `${page === 0 ? 1 : (page * rowsPerPage)+1} - ${end > count ? count : end} of ${count}`;
       
        return sText;
    }, [count, page, rowsPerPage])

    return (
            <Grid container spacing={1} justifyContent={"flex-end"} alignItems={"center"}>
                <Grid item>
                    หน้า
                    {" "}
                    <Select
                        size="small"
                        autoWidth
                        sx={{
                            height: 30,
                            ".MuiOutlinedInput-notchedOutline > legend": {
                                width: 0,
                            },
                        }}
                        value={page+1}
                        onChange={(e) => {                            
                            handleChangePage(null, e.target.value)
                        }}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 150 } } }}
                    >
                        {lstJump.map((item, index) => {
                            let sKey = `JumpPage_${item.value}`;
                            let sLabel = item.label;
                            return (
                                <MenuItem key={sKey} value={item.value}>
                                    {sLabel}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </Grid>
                <Grid item>
                    <Typography sx={{ whiteSpace: "nowrap" }}>
                        {TextTotal}
                    </Typography>
                </Grid>
                <Grid item>
                    <Pagination
                        count={Math.ceil(count / rowsPerPage)}
                        variant="outlined"
                        shape="rounded"
                        size="small"
                        color="primary"
                        siblingCount={0}
                        boundaryCount={1}
                        page={page + 1}
                        showFirstButton
                        showLastButton
                        onChange={handleChangePage}
                        style={{ right: "0" }}
                    />
                </Grid>
                <Grid item>
                    <Select
                        labelId="select-paging-label"
                        id="select-paging"
                        value={rowsPerPage}
                        onChange={(e) => {
                            handleChangeRowsPerPage(e);
                        }}
                        autoWidth
                        size="small"
                        style={{ height: "31px", marginLeft: "10px" }}
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                    </Select>
                </Grid>
            </Grid>
    );
}
