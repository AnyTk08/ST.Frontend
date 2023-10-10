import {
  Box,
  Grid,
  Pagination,
  PaginationItem,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AutoCompleteInTable from "components/DataGrid/AutoCompleteInTable";
import './Paginations.css'
import { FaRegCalendarAlt } from "react-icons/fa"; 
import { BsArrowRight } from "react-icons/bs"; 

const usePagination = (data, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);

  function currentData() {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }

  function next() {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  }

  function prev() {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  function jump(page) {
    const pageNumber = Math.max(1, page);
    setCurrentPage((currentPage) => Math.min(pageNumber, maxPage));
  }

  return { next, prev, jump, currentData, currentPage, maxPage };
};

export const Paginations = (props) => {
  const [perpage] = useState(3);
  const count = Math.ceil(props.data.length / perpage);
  const _DATA = usePagination(props.data, perpage);
  let [page, setPage] = useState(1);
  let [lstPageData, setLstPageData] = useState([]);

  const handleChange = (e, p) => {
    console.log("p", p);
    console.log("e", e);
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    if (props.data) {
      let lstData = [];
      for (let i = 0; i < count; i++) {
        lstData.push({ label: i + 1, value: i + 1 });
      }
      setLstPageData(lstData);
    }
  }, [props.data]);

  const pageNext = () => {
    return <>Next</>;
  };

  const pagePrevious = () => {
    return <>Previous</>;
  };

  const pageLast = () => {
    return <>Last</>;
  };

  const pageFirst = () => {
    return <>First</>;
  };

  return (
    <Grid container>
      {_DATA.currentData().map((item, index) => (
        // <Box
        //   key={item.value}
        //   sx={{ width: "150px", height: "150px", border: "1px solid red" }}
        // >
        //   {item.value}
        // </Box>
        <div key={item.value} className="cards-news">
          <div className="image-box" style={{backgroundImage: `url(https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8TmV3c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60)`,}}></div>
          <div className="content-box" >
            <span className="date-tags">
              <div className="date-news">05 May 2023</div><FaRegCalendarAlt className="date-icons"/>
            </span>
            <div className="news-detail">
              <Box sx={{width:"100%",height:"80px",overflow:"hidden"}}>
              <Typography sx={{color:"#344767",fontWeight:500,lineHeight:1}}>There's goting to be a musical about a meghan</Typography>
                <Typography sx={{fontSize:"0.875rem",lineHeight:1,mt:"0.5rem",color:"#67748e"}}>Creepeth green light appear let rule only you're divide and lights moving and isn't given creeping deep.</Typography>
              </Box>
                <Box sx={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",mt:"0.7rem"}}>
                  <Box sx={{width:"70%"}}>
                    <span className="badge-news" style={{color:"#3e97ff",background:"#eef6ff"}}>News</span>
                    <span className="badge-news" style={{color:"#f1416c",background:"#fff5f8"}}>Pagination</span>
                  </Box>
                  <Box className="readmore-news" sx={{width:"30%"}}>Read More <BsArrowRight/></Box>
                </Box>
              </div>
          </div>
        </div>
      ))}
      <Stack
        spacing={2}
        style={{ margin: "3rem auto 2rem", alignItems: "center" }}
      >
        <AutoCompleteInTable
          small
          sxCustom={{
            ".MuiOutlinedInput-root": {
            //   padding: "4.5px 14px !important",
              height: "30px",
              ".MuiOutlinedInput-notchedOutline > legend": {
                width: 0,
              },
            },
          }}
          objValue={
            lstPageData.find((f) => f.value === page)
              ? lstPageData.find((f) => f.value === page)
              : { label: 1, value: 1 }
          }
          funcOnChange={() => {}}
          lstOption={lstPageData}
          disClearable
        />
        <Pagination
          count={count}
          page={page}
          onChange={handleChange}
          color="primary"
          renderItem={(item) => (
            <PaginationItem
              components={{
                first: pageFirst,
                previous: pagePrevious,
                next: pageNext,
                last: pageLast,
              }}
              {...item}
            />
          )}
          showFirstButton
          showLastButton
        />
      </Stack>
    </Grid>
  );
};
