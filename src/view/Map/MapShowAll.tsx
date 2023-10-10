/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createRef, useRef, useState } from 'react'
import MapCompoents from './MapCompoents'
import { Grid } from '@mui/material'
import { BtnDownload } from 'components/Button'
import html2canvas from "html2canvas";
import UploadFile from 'components/Input/UploadFile/UploadFile'
import { Extension } from 'utilities/ST_Function'
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import yupFormSchemas from 'components/FormItem/yupFormSchemas'

const MapShowAll = () => {

    const ref = createRef() as any;

    const mapRefView = useRef(null);
    const mapRefArea = useRef(null);

    const [lstFileProjectDocument, setlstFileProjectDocument] = useState([] as any)
    const onClearFileProject = useRef(null);
    const [arrMarkerView, setarrMarkerView] = useState([
        {
            "address": null,
            "lat": 13.7563309,
            "lng": 100.5017651,
            "label": "2",
            "childTicket": [
                {
                    "label": "1.โครงการรักษ์น้ำรักษ์ปลา (1.กรุงเทพมหานคร)",
                    "nProjectID": 1,
                    "sProjectName": "โครงการรักษ์น้ำรักษ์ปลา",
                    "nAreaID": 1,
                    "sAreaName": "กรุงเทพมหานคร",
                    "sModeBtn": 4
                },
                {
                    "label": "2.โครงการรักษ์น้ำรักษ์ปลา (3.กรุงเทพมหานคร)",
                    "nProjectID": 1,
                    "sProjectName": "โครงการรักษ์น้ำรักษ์ปลา",
                    "nAreaID": 36,
                    "sAreaName": "กรุงเทพมหานคร",
                    "sModeBtn": 4
                }
            ]
        },
        {
            "address": null,
            "lat": 13.756331,
            "lng": 100.501765,
            "label": "1",
            "childTicket": [
                {
                    "label": "1.โครงการรักษ์น้ำรักษ์ปลา (2.TEST Map)",
                    "nProjectID": 1,
                    "sProjectName": "โครงการรักษ์น้ำรักษ์ปลา",
                    "nAreaID": 35,
                    "sAreaName": "TEST Map",
                    "sModeBtn": 4
                }
            ]
        },
        {
            "address": null,
            "lat": 13.9138642,
            "lng": 100.4199901,
            "label": "1",
            "childTicket": [
                {
                    "label": "1.ศูนย์พัฒนาเด็กเล็ก (1.โสนลอย บางบัวทอง นนทบุรี)",
                    "nProjectID": 9,
                    "sProjectName": "ศูนย์พัฒนาเด็กเล็ก",
                    "nAreaID": 8,
                    "sAreaName": "โสนลอย บางบัวทอง นนทบุรี",
                    "sModeBtn": 4
                }
            ]
        },
        {
            "address": null,
            "lat": 17.5165974,
            "lng": 104.0769024,
            "label": "1",
            "childTicket": [
                {
                    "label": "1.ศูนย์พัฒนาเด็กเล็ก (2.โรงเรียนอนุบาลสวนเล็กบางแพรก)",
                    "nProjectID": 9,
                    "sProjectName": "ศูนย์พัฒนาเด็กเล็ก",
                    "nAreaID": 9,
                    "sAreaName": "โรงเรียนอนุบาลสวนเล็กบางแพรก",
                    "sModeBtn": 4
                }
            ]
        },
        {
            "address": null,
            "lat": 13.7563309,
            "lng": 100.5017651,
            "label": "1",
            "childTicket": [
                {
                    "label": "1.โครงการบ้านล้านหลัง (1.กรุงเทพมหานคร)",
                    "nProjectID": 10,
                    "sProjectName": "โครงการบ้านล้านหลัง",
                    "nAreaID": 10,
                    "sAreaName": "กรุงเทพมหานคร",
                    "sModeBtn": 4
                }
            ]
        },
        {
            "address": null,
            "lat": 13.7286594,
            "lng": 100.5010205,
            "label": "1",
            "childTicket": [
                {
                    "label": "1.การยกระดับความรู้การคัดเมล็ดพันธุ์ข้าว เพื่อการผลิตข้าวที่มีคุณภาพ (1.มหาวิทยาลัยราชภัฏศรีสะเกษ)",
                    "nProjectID": 26,
                    "sProjectName": "การยกระดับความรู้การคัดเมล็ดพันธุ์ข้าว เพื่อการผลิตข้าวที่มีคุณภาพ",
                    "nAreaID": 18,
                    "sAreaName": "มหาวิทยาลัยราชภัฏศรีสะเกษ",
                    "sModeBtn": 4
                }
            ]
        },
        {
            "address": null,
            "lat": 16.9355475,
            "lng": 103.6246954,
            "label": "1",
            "childTicket": [
                {
                    "label": "1.โครงการเสริมสร้างการมีส่วนร่วมในการสร้างความปรองดองสมานฉันท์ในชุมชนด้วยสันติวิธี (1.ทุ่งคลอง คำม่วง กาฬสินธุ์)",
                    "nProjectID": 30,
                    "sProjectName": "โครงการเสริมสร้างการมีส่วนร่วมในการสร้างความปรองดองสมานฉันท์ในชุมชนด้วยสันติวิธี",
                    "nAreaID": 19,
                    "sAreaName": "ทุ่งคลอง คำม่วง กาฬสินธุ์",
                    "sModeBtn": 4
                }
            ]
        },
        {
            "address": null,
            "lat": 13.7563309,
            "lng": 100.5017651,
            "label": "1",
            "childTicket": [
                {
                    "label": "1.โครงการเสริมสร้างการมีส่วนร่วมในการสร้างความปรองดองสมานฉันท์ในชุมชนด้วยสันติวิธี (2.กองส่งเสริมการบริการวิชาการ)",
                    "nProjectID": 30,
                    "sProjectName": "โครงการเสริมสร้างการมีส่วนร่วมในการสร้างความปรองดองสมานฉันท์ในชุมชนด้วยสันติวิธี",
                    "nAreaID": 20,
                    "sAreaName": "กองส่งเสริมการบริการวิชาการ",
                    "sModeBtn": 4
                }
            ]
        },
        {
            "address": null,
            "lat": 13.7563309,
            "lng": 100.5017651,
            "label": "1",
            "childTicket": [
                {
                    "label": "1.Flow Update_ สคญ. (1.กรุงเทพมหานคร)",
                    "nProjectID": 63,
                    "sProjectName": "Flow Update_ สคญ.",
                    "nAreaID": 70,
                    "sAreaName": "กรุงเทพมหานคร",
                    "sModeBtn": 4
                }
            ]
        },
        {
            "address": null,
            "lat": 19.3678141,
            "lng": 98.9649024,
            "label": "1",
            "childTicket": [
                {
                    "label": "1.โครงการปรับเปลี่ยนข้อมูลปี (1.พัฒนาดอยเชียงดาว)",
                    "nProjectID": 68,
                    "sProjectName": "โครงการปรับเปลี่ยนข้อมูลปี",
                    "nAreaID": 77,
                    "sAreaName": "พัฒนาดอยเชียงดาว",
                    "sModeBtn": 4
                }
            ]
        },
        {
            "address": null,
            "lat": 7.634865100000001,
            "lng": 99.0902873,
            "label": "1",
            "childTicket": [
                {
                    "label": "1.โครงการปรับเปลี่ยนข้อมูลปี (2.เกาะลันตา ลายตา)",
                    "nProjectID": 68,
                    "sProjectName": "โครงการปรับเปลี่ยนข้อมูลปี",
                    "nAreaID": 78,
                    "sAreaName": "เกาะลันตา ลายตา",
                    "sModeBtn": 4
                }
            ]
        }
    ] as any)
    const [oMarkerArea, setoMarkerArea] = useState(null);
    const [sInput] = useState("")
    const [lat] = useState("")
    const [lng] = useState("")


    const schema = yup.object().shape({
        sUsername: yupFormSchemas.string("ชื่อผู้ใช้งาน", { required: true }),
        sSecureCode: yupFormSchemas.string("รหัสผ่าน", { required: true }),
    });
    const formResolver = yupResolver(schema);

    const form = useForm({
        resolver: formResolver,
        shouldUnregister: false,
        shouldFocusError: true,
        mode: "all",
        defaultValues: {} as any,
    });



    const downloadImage = () => {
        const table = document.getElementById('mapURL');

        html2canvas(table).then(function (canvas) {
            const link = document.createElement('a');
            link.download = 'mapURL.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }

    const getImage = () => {
        // takeScreenShot(ref.current)
        html2canvas(ref.current).then(function (canvas) {
            const link = document.createElement('a');
            link.download = 'table.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };

    const getMapImage = async () => {
        const apiKey = "AIzaSyAmwA8tw1ZXG8fo16T3ymx2HY3Q1gw6dwU";

        const params = new URLSearchParams({
            center: '15.2081378,99.96886359999999', // Latitude and longitude of the map center
            zoom: '13', // Zoom level
            size: '600x400', // Image size
            maptype: 'roadmap', // Map type
            markers: '15.2081378,99.96886359999999', // Latitude and longitude of the marker
            key: apiKey,
        });

        const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;

        // Fetch the image
        fetch(imageUrl)
            .then((response) => response.blob())
            .then((blob) => {
                // Convert the image blob to a base64 string
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                };
            })
            .catch((error) => {
                console.error('Error fetching the image:', error.message);
            });
    };


    return (
        <React.Fragment>
            <div>
                {/* <GetLoaction /> */}
                <Grid container spacing={2} justifyContent={"center"}>
                    <Grid item xs={12}>
                        <FormProvider {...form}>

                            <UploadFile
                                IsRequired={false}
                                modeDisplay={"gallery"}
                                id={"oFileDocument"}
                                name={"oFileDocument"}
                                keyID={1}
                                IsDrag={false}
                                arrFile={lstFileProjectDocument}
                                setarrFile={setlstFileProjectDocument}
                                Extension={Extension.ImageDocument}
                                IsFolder={true}
                                IsMultiple={true}
                                onClearFile={onClearFileProject}
                                sFolderTemp="DocumentProject"
                                nLimitFile={3}
                                sLimitFile="MB"
                                sPositionText="right"
                                IsMultiDelete={false}
                                IsAddDescription={true}
                                nCountLimitFile={5}
                            />
                        </FormProvider>
                    </Grid>
                    <Grid item>
                        <BtnDownload
                            id="btn05"
                            txt="Axios Map"
                            onClick={() => {
                                getMapImage();
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <BtnDownload
                            id="btn03"
                            txt="Load Map"
                            onClick={() => {
                                downloadImage();
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <BtnDownload
                            id="btn04"
                            txt="Load Capture"
                            onClick={() => {
                                getImage();
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <div ref={ref}>
                                    <MapCompoents
                                        id={"div-view"}
                                        mapRef={mapRefView}
                                        IsMultiMarker={true}
                                        Isdisable={true}
                                        IsMarker={false}
                                        IsPopUp={true}
                                        IsSearch={false}
                                        IsFullScreen={false}
                                        // sHeight="300px"
                                        arrMarker={arrMarkerView}
                                        setarrMarker={setarrMarkerView}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <MapCompoents
                                    id={"div-search"}
                                    mapRef={mapRefArea}
                                    IsMultiMarker={false}
                                    Isdisable={false}
                                    IsMarker={true}
                                    IsMarkerSearch={false}
                                    IsPopUp={true}
                                    IsSearch={true}
                                    markerSearch={oMarkerArea}
                                    setmarkerSearch={setoMarkerArea}
                                    sSearch={sInput}
                                    latSearch={lat}
                                    lngSearch={lng}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </React.Fragment>
    );
}

export default MapShowAll
