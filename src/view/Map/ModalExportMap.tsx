import React, { useRef ,useEffect } from 'react'
import { Grid } from '@mui/material';
import DialogPreview from 'components/Dialog/DialogPreview';

import { BtnBaseButton } from 'components/Button';
import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
//Map 
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
} from '@react-google-maps/api'

const Input = styled(MuiInput)`
  width: 42px;
`;

const ModalExportMap = (props) => {

    const { isOpen, setIsOpen, Title, locationLatLng, bgColor = "#5197ff", setBase64 } = props;

    const mapModalRef = useRef(null);

    const [zoom, setZoom] = React.useState(14);


    useEffect(() => {
        if (isOpen) {
            setZoom(14)

        }
    }, [isOpen, locationLatLng])



    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
        id: 'google-map-script',

    })



    const handleSliderChange = (event) => {
        setZoom(Number(event.target.value));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let nValue = event.target.value === '' ? 0 : Number(event.target.value);
        if (nValue < 4) {
            setZoom(4);
        } else if (nValue > 18) {
            setZoom(18);
        } else {
            setZoom(nValue);
        }

    };

    const getMapImage = async () => {
        const apiKey = "AIzaSyAmwA8tw1ZXG8fo16T3ymx2HY3Q1gw6dwU";

        let sMark = locationLatLng.lat + "," + locationLatLng.lng;
        let params = new URLSearchParams({
            center: sMark, // Latitude and longitude of the map center
            zoom: zoom + "", // Zoom level
            size: '600x400', // Image size
            maptype: 'roadmap', // Map type
            markers: sMark, // Latitude and longitude of the marker
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
                    const base64String = reader.result;
                    setBase64(base64String)

                };
            })
            .catch((error) => {
                console.error('Error fetching the image: ', error.message);
            });
        setIsOpen(false);
    };

    const onUnmount = React.useCallback(function callback(map) {
        mapModalRef.current = null;
    }, [mapModalRef])


    return (
        <DialogPreview
            IsOpen={isOpen}
            onClose={() => { setIsOpen(false); }}
            Title={Title}
            sMaxWidth='sm'
            bgColor={bgColor}
            Color='white'
        >
            <Grid container spacing={2} justifyContent={"center"}>
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item >
                            <SearchSharpIcon />
                        </Grid>
                        <Grid item xs>
                            <Slider
                                value={typeof zoom === 'number' ? zoom : 0}
                                onChange={handleSliderChange}
                                aria-labelledby="input-slider"
                                style={{
                                    color: bgColor
                                }}
                                min={4}
                                max={18}
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                value={zoom}
                                id='zoom-slider'
                                size="small"
                                onChange={handleInputChange}
                                inputProps={{
                                    step: 1,
                                    min: 4,
                                    max: 18,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={'auto'}>
                            <Grid container spacing={2} justifyContent={"center"} alignItems="center">
                                <Grid item>
                                    <BtnBaseButton
                                        txt={"Export"}
                                        size={"medium"}
                                        startIcon={<FileDownloadRoundedIcon />}
                                        isRadius={true}
                                        isDisabled={false}
                                        isHidden={false}
                                        onClick={getMapImage}
                                        isCircleWithOutText={false}
                                        bgcolor={bgColor}
                                        bgcolorHover={bgColor}
                                        fontColor='#ffffff'
                                        id={"export-modal"}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {!isLoaded ? (
                        <h1>Loading...</h1>
                    ) :
                        <GoogleMap
                            mapContainerStyle={{
                                width: '100%',
                                height: '400px',
                                borderRadius: '14px',
                                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                            }}
                            onLoad={map => {
                                mapModalRef.current = map
                            }}
                            onUnmount={onUnmount}
                            zoom={zoom}
                            center={locationLatLng}
                            options={{
                                streetViewControl: false,
                                scaleControl: false,
                                fullscreenControl: false,
                                disableDoubleClickZoom: true,
                                draggable: false,
                                scrollwheel: false,
                                disableDefaultUI: true,
                                mapTypeControl: false,
                                mapTypeId: google.maps.MapTypeId.ROADMAP,
                            }}
                        >
                            <Marker
                                position={locationLatLng}
                                draggable={false}
                                animation={google.maps.Animation.DROP}
                            />
                        </GoogleMap>
                    }
                </Grid>
            </Grid>
        </DialogPreview>
    )
}

export default ModalExportMap
