import { useEffect, useState } from "react";
import "./Swiper.css";
import { ImageProps, SwiperGellaryProps } from "./Swiper";
import { Autoplay, Navigation, FreeMode, Thumbs } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import sNoImageAvailable from "assets/images/NoImage/no-image-available.png";

export const SwiperGellary = (props: SwiperGellaryProps) => {

    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [arrImage, setArrImage] = useState([] as ImageProps[]);

    useEffect(() => {
        if (props.arrImage) {
            setArrImage(props.arrImage)
        } else {
            setArrImage([]);
        }
    }, [props.arrImage]);

    const onImageError = (e) => {
        e.target.src = sNoImageAvailable;
    }

    return (
        <>
            {arrImage &&
                <>
                    <Swiper
                        loop={true}
                        spaceBetween={10}
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        modules={[Autoplay, FreeMode, Navigation, Thumbs]}
                        className="ImageSwiper"
                    >
                        {arrImage.map((m, i) => (
                            <SwiperSlide key={m.sID} id={m.sID}>
                                <p className="Swiper-Description">{m.sDescription}</p>
                                <img
                                    width={"100%"}
                                    height={"100%"}
                                    alt={m.sDescription}
                                    src={m.sFileLink ?? sNoImageAvailable}
                                    onError={onImageError}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {arrImage.length > 1 &&
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            loop={true}
                            spaceBetween={10}
                            slidesPerView={4}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="ImageSwiperPreview"
                        >
                            {arrImage.map((m, i) => (
                                <SwiperSlide key={`Preview_${m.sID}`} id={`Preview_${m.sID}`}>
                                    <img
                                        alt={m.sDescription}
                                        src={m.sFileLink ?? sNoImageAvailable}
                                        onError={onImageError}
                                        style={{ minHeight: "100px" }}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    }
                </>
            }
        </>
    );
}