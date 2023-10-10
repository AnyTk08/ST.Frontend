import Zoom from "@mui/material/Zoom";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { Fab } from "@mui/material";
import { HiOutlineArrowNarrowDown, HiOutlineArrowNarrowUp } from "react-icons/hi";

export const ScrollToButton = () => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 500,
  });
  const handleClickBottom = (event) => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleClickTop = (event) => {
    window.scrollTo({ top: 0, behavior: `smooth` })
  };

  return (
    <>
      <Zoom in={!trigger}>
        <div
          onClick={handleClickBottom}
          role="presentation"
          // className={classes.bottom}
          style={{
            position: "fixed",
            bottom: "12px",
            left: "25px",
            width: "50px",
            height: "90px",
          }}
          id="toButtom"
        >
          <Fab
            size="large"
            className='btn-scroll-bottom'
            sx={{
              borderRadius: "16px",
              width: "35px",
              height: "70px",
              textAlign: "center",
              fontSize: "13px",
            }}
          >
            <HiOutlineArrowNarrowDown size="25" style={{ color: '#ffffff' }} />
          </Fab>
        </div>
      </Zoom>
      <Zoom in={trigger}>
        <div onClick={handleClickTop} role="presentation" 
        // className={classes.top}
        style={{
          position: "fixed",
          bottom: "12px",
          left: "25px",
          width: "50px",
          height: "90px",
        }}
        >
          <Fab
            size="large"
            className='btn-scroll-top'
            sx={{
              borderRadius: "16px",
              width: "35px",
              height: "70px",
              textAlign: "center",
              fontSize: "13px",
            }}
          >
            <HiOutlineArrowNarrowUp size="25" style={{ color: '#ffffff' }} />
          </Fab>
        </div>
      </Zoom>
    </>

  );
};
