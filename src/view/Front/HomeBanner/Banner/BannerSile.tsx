import React, { useEffect, useState, useRef } from 'react';
import No_BG from "../../../../assets/images/NoImage/no-image-available.png";
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './bannersild.css'

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper';
import { Box, Skeleton } from '@mui/material';



export default function SwiperComponent(props: IBannerSlideBar) {
  const [IMGModal] = useState<string>(No_BG);
  const swiperRef = useRef<any>(null);
  const [isShown, setIsShown] = useState(false);
  const waitBeforeShow = 500;

  const GetUrlImage = (iGroup) => {
    let sURLImgGroup = IMGModal;
    if (iGroup.fFileBaner.sFileLink != null && iGroup.fFileBaner.sFileLink !== "") {
      sURLImgGroup = iGroup.fFileBaner.sFileLink;
    }

    return sURLImgGroup;
  }
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
    }, waitBeforeShow);
    return () => clearTimeout(timer);
  }, [waitBeforeShow]);
  return (
    <>
    {(isShown && props.lstData.length > 0) && 
    <>
          <div className="swiper-pagination"></div>
          <Box style={{ position: "relative" }}>
          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={0}
            slidesPerView={1}
            speed={2000}
            loop={true}
            centeredSlides={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
              dynamicBullets:true
            }}
            scrollbar={{
              hide: true,
            }}
            navigation={true}
            modules={[Pagination, Autoplay, Navigation]}
            className="mySwiper BannerSlideSwiperTwo"
          >
            {(props.lstData).map((item, index) => {
              let sKeySlide = `img_${index}`;
              let sURLImgGroup = GetUrlImage(item);
              return (
                <SwiperSlide key={sKeySlide} className="SlideSwiperCustomSild">
                       <img
                    alt="Banner"
                    src={sURLImgGroup}
                    style={{
                      cursor: item.sUrl ? "pointer" : "",
                      display: "block",
                      width: "100vw",
                      objectFit:"cover"
                    }}
                    onError={(e) => { e.currentTarget.src = IMGModal }}
                  />
                 
                </SwiperSlide>
              );
            })}
          </Swiper>
          </Box>
          </>
      }
      {!isShown && 
      <Skeleton variant="rectangular" style={{width:"100%" , height:"500px",borderTopLeftRadius:"6rem",borderBottomRightRadius:"6rem"}}/>
      }

      {(isShown && props.lstData.length == 0) && 
    <>
    <div className='BannerSlideSwiperTwo'>
    <div className='SlideSwiperCustomSild'>
       <img
                    alt="Banner"
                    src={IMGModal}
                    style={{
                      display: "block",
                      width: "100vw",
                      borderTopLeftRadius: "6rem",
                      borderBottomRightRadius: "6rem",
                      objectFit:"cover"
                    }}
                    onError={(e) => { e.currentTarget.src = IMGModal }}
                  />
    </div>
    </div>
          </>
      }
    </>
  );
}

export interface IBannerSlideBar {
  lstData: Array<any>
}
