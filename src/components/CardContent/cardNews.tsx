import React from 'react'
import {
  Box,
  Typography,
} from "@mui/material";
import { BsArrowRight } from "react-icons/bs";
import { FaRegCalendarAlt } from "react-icons/fa";
import './Card.css'

export default function CardNews(props) {
  return (
    <React.Fragment>
      <div className="cards-news">
        <div
          className="image-box"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8TmV3c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60)`,
          }}
        ></div>
        <div className="content-box">
          <span className="date-tags">
            <div className="date-news">05 May 2023</div>
            <FaRegCalendarAlt className="date-icons" />
          </span>
          <div className="news-detail">
            <Box sx={{ width: "100%", height: "80px", overflow: "hidden" }}>
              <Typography
                sx={{ color: "#344767", fontWeight: 500, lineHeight: 1 }}
              >
                There's goting to be a musical about a meghan {props.item.sName}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  lineHeight: 1,
                  mt: "0.5rem",
                  color: "#67748e",
                }}
              >
                Creepeth green light appear let rule only you're divide and
                lights moving and isn't given creeping deep.
              </Typography>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: "0.7rem",
              }}
            >
              <Box sx={{ width: "70%" }}>
                <span
                  className="badge-news"
                  style={{ color: "#3e97ff", background: "#eef6ff" }}
                >
                  News
                </span>
                <span
                  className="badge-news"
                  style={{ color: "#f1416c", background: "#fff5f8" }}
                >
                  Pagination
                </span>
              </Box>
              <Box className="readmore-news" sx={{ width: "30%" }}>
                Read More <BsArrowRight />
              </Box>
            </Box>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
