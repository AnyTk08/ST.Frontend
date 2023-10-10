import { AxiosGet, AxiosPost } from "utilities/ST_Axios";


export const GetDataHomeBannerTable = async (objJSON, fnSuccess, fnError) => {
    AxiosPost("HomeBanner/GetDataHomeBannerTable", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}


export const GetBannerSwiper = async (objJSON, fnSuccess, fnError) => {
     AxiosGet("HomeBanner/GetBanner", objJSON, (res) => {
        fnSuccess(res);
    },(err) => {fnError(err)});
}


