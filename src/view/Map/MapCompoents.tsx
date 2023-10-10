import React, { useEffect, useState } from 'react'
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    InfoWindow,
    Autocomplete,
} from '@react-google-maps/api'
import "./map.css"
import { MapProp } from './InterfaceMap';
import { OpenNewTab } from 'utilities/ST_Function';
import Geocode from "react-geocode";
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, Tooltip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { useNavigate } from 'react-router-dom';
import { TypeModeBtn } from 'components/enum/enumSystem';

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
Geocode.setRegion("th");
Geocode.setLanguage("th");

const MapCompoents = (props: MapProp) => {

    const {
        id,
        mapRef,
        IsMultiMarker = true,
        Isdisable = false,
        IsMarker = true,
        IsPopUp = true,
        IsSearch = true,
        IsFullScreen = true,
        IsMarkerSearch = true,
        sHeight = "500px",
        arrMarker = [],
        markerSearch,
        setmarkerSearch,
        sSearch = "",
        latSearch,
        lngSearch,
        formArea,
    } = props;

    const navigate = useNavigate();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
        id: 'google-map-script',

    })

    const [searchBox, setsearchBox] = useState() as any;
    const [isOpen, setIsOpen] = useState(false);
    const [isCanMarker, setisCanMarker] = useState(false)
    const [infoWindowData, setInfoWindowData] = useState(null);
    const [sInput, setsInput] = useState("")

    useEffect(() => {
        const map = mapRef?.current;
        if (map) {
            if (sSearch !== "") {
                const service = new window.google.maps.places.PlacesService(map);
                getPosition(service, sSearch)
            }
            else if (latSearch !== "" && lngSearch !== "") {
                getPositionFromLanLng(latSearch, lngSearch)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [latSearch, lngSearch, mapRef, sSearch]);

    useEffect(() => {
        const map = mapRef.current;
        if (map && arrMarker.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            arrMarker?.forEach(({ lat, lng }) => { bounds.extend({ lat, lng }) });

            map.fitBounds(bounds);
            if (setmarkerSearch) {
                setmarkerSearch(null)
            }
        }
    }, [arrMarker, mapRef, setmarkerSearch]);

    const getPosition = (service, sSearch) => {
        let request = {
            query: sSearch,
            fields: ["name", "formatted_address", "geometry"]
        };

        service.findPlaceFromQuery(request, async (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                let oResult = results.length > 0 ? results[0] : null;
                if (oResult) {
                    let lat = parseFloat(oResult.geometry.location.lat());
                    let lng = parseFloat(oResult.geometry.location.lng());

                    await onSetMarker(lat, lng);
                    if (oResult.geometry.viewport) {
                        let bounds = new window.google.maps.LatLngBounds(oResult.geometry.viewport);
                        mapRef.current.fitBounds(bounds);
                    }
                }
            }
        });
    };

    const getPositionFromLanLng = (lat, lng) => {

        let nLat = parseFloat(lat)
        let nLng = parseFloat(lng)

        onSetMarker(nLat, nLng);
        let bounds = new window.google.maps.LatLngBounds({ lat: nLat, lng: nLng });
        mapRef.current.fitBounds(bounds);

    };

    const handleMarkerClick = async (id, item) => {
        if (item != null) {
            const { lat, lng } = item;
            if (IsPopUp) {
                let address = await getAddressfromLatLng(lat, lng)

                setInfoWindowData({ id, address, lat, lng, url: getGoogleMapsUrl(lat, lng), childTicket: item.childTicket ?? [] });
                mapRef.current.panTo({ lat, lng });
                mapRef.current.setZoom(15);
                setIsOpen(true);
            }
        }
    };

    const onUnmount = React.useCallback(function callback(map) {
        mapRef.current = null;
    }, [mapRef])

    const onLoad = (mapInstance: google.maps.places.Autocomplete) => {
        setsearchBox(mapInstance);
    }

    const onPlaceChanged = async () => {
        if (searchBox !== null) {
            let place = searchBox.getPlace();
            let lat = parseFloat(place.geometry.location.lat());
            let lng = parseFloat(place.geometry.location.lng());
            setsInput(place.formatted_address);

            if (IsMarkerSearch) {
                await onSetMarker(lat, lng);
            }
            if (place.geometry.viewport) {
                let bounds = new window.google.maps.LatLngBounds(place.geometry.viewport);
                mapRef.current.fitBounds(bounds);
            }
        }
    }

    const onMapClick = async (event) => {
        if (!Isdisable && isCanMarker && IsMarker && event) {
            let onlatlng = event.latLng;
            let lat = parseFloat(onlatlng.lat());
            let lng = parseFloat(onlatlng.lng());
            await onSetMarker(lat, lng);
        }
    };

    const onSetMarker = async (lat, lng) => {
        if (formArea) {
            formArea.setValue("sLatitude", lat)
            formArea.setValue("sLongitude", lng)
        }
        let address = await getAddressfromLatLng(lat, lng)
        let url = getGoogleMapsUrl(lat, lng);
        if (setmarkerSearch) {
            setmarkerSearch({ address: address, lat: lat, lng: lng, url: url, childTicket: [] })
        }
        setInfoWindowData({ id: 9999, address, lat, lng, url: url, childTicket: [] });
    }

    const deleteMarker = () => {
        let arrMark = arrMarker;
        if (infoWindowData) {
            let findID = arrMark.findIndex(f => f.lat === infoWindowData.lat && f.lng === infoWindowData.lng);
            if (findID > -1) {
                arrMark.splice(findID, 1);
                setInfoWindowData(null)
                setIsOpen(false)
            }
        }
    }

    const getAddressfromLatLng = async (ParamLat, ParamLng) => {
        let address = "";
        await Geocode.fromLatLng(ParamLat, ParamLng).then(
            (response) => {
                let result = response.results[0];
                address = result.formatted_address;
            },
            (error) => {
                console.error("Get Address Error", error);
            }
        );
        return address;
    }

    const getGoogleMapsUrl = (lat, lng) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        return url;
    };


    const goToDetailProject = (nProjectID, nAreaID) => {
        if (nProjectID) {
            navigate(`/project-report`,
                {
                    state:
                    {
                        nProjectID: nProjectID,
                        nAreaID: nAreaID,
                        sModeBtn: TypeModeBtn.ViewProject,
                    }
                }
            );
        }
    };


    function PopUpInfoMap(): React.ReactNode {
        return <InfoWindow
            onCloseClick={() => {
                setIsOpen(false);
            }}
        >
            <div>
                <Grid container spacing={2} justifyContent={"flex-start"} alignItems={"flex-end"}>
                    <Grid item xs={12} >
                        <h3>{infoWindowData.address}</h3>
                    </Grid>
                    <Grid item xs={12} >
                        {
                            infoWindowData.childTicket.map(itmTicket => {
                                let sKey = itmTicket.nProjectID + itmTicket.nAreaID
                                return (
                                    <Tooltip key={sKey} title={itmTicket.sAreaName} arrow placement="top-start">
                                        <p
                                            className='underline-on-hover-text'
                                            onClick={() => goToDetailProject(itmTicket.nProjectID, itmTicket.nAreaID)}
                                        >
                                            {itmTicket.sProjectName}
                                        </p>
                                    </Tooltip>

                                );
                            })
                        }
                    </Grid>
                    <Grid item xs={12} >
                        <Grid container justifyContent={"space-between"}>
                            <Grid item >
                                <p className='underline-on-hover-text' onClick={() => { OpenNewTab(infoWindowData.url); }}>View on Google Maps</p>
                            </Grid>
                            <Grid item >
                                <IconButton aria-label="delete" size="small" onClick={() => { deleteMarker(); }} style={{ display: !Isdisable && isCanMarker ? "" : "none" }}>
                                    <DeleteIcon fontSize="inherit" style={{ color: '#ff0000' }} />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </InfoWindow>;
    }

    return (
        <div id={id} style={{ width: '100%', height: '100%', position: 'relative' }}>
            {!isLoaded ? (
                <h1>Loading...</h1>
            ) :
                (
                    <>
                        {IsMarker && <Tooltip title={!isCanMarker ? "เปิดการใช้งาน Marker" : "ปิดการใช้งาน Marker"} placement="left">
                            <div className='btn-marker'
                                onClick={() => {
                                    // setmarkerSearch(null)
                                    setisCanMarker(e => !e)
                                }}
                            >
                                <LocationOnIcon style={{ display: !isCanMarker ? "" : "none", color: 'red' }} />
                                <NotInterestedIcon style={{ display: isCanMarker ? "" : "none", color: 'red' }} />
                            </div>
                        </Tooltip>}
                        <GoogleMap
                            mapContainerStyle={{
                                width: '100%',
                                height: sHeight,
                                borderRadius: '14px',
                                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                            }}
                            // onLoad={onMapLoad}
                            onLoad={map => {
                                mapRef.current = map

                                if (arrMarker && arrMarker.length > 0) {
                                    const bounds = new google.maps.LatLngBounds();
                                    arrMarker?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
                                    mapRef.current.fitBounds(bounds);
                                }
                                else {
                                    const bounds = new google.maps.LatLngBounds();
                                    //Default Thailand
                                    let arr = [
                                        { lat: 20.202186889782737, lng: 99.97373323585657 },
                                        { lat: 6.116302058707464, lng: 101.39298630298904 },
                                    ];
                                    arr.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
                                    mapRef.current.fitBounds(bounds);
                                }
                            }}
                            onUnmount={onUnmount}
                            zoom={5}
                            onClick={(e) => {
                                setIsOpen(false);
                                onMapClick(e);
                            }}
                            options={{
                                streetViewControl: false,
                                scaleControl: true,
                                fullscreenControl: IsFullScreen,
                                disableDoubleClickZoom: true,
                                // disableDefaultUI: Isdisable,
                                scrollwheel: false,
                                gestureHandling: "cooperative",
                                disableDefaultUI: false,
                                minZoom: 3,
                                maxZoom: 19,
                                mapTypeControl: false,
                                mapTypeId: google.maps.MapTypeId.ROADMAP,
                                mapTypeControlOptions: {
                                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                                    position: google.maps.ControlPosition.BOTTOM_CENTER,
                                },
                                zoomControlOptions: {
                                    position: google.maps.ControlPosition.RIGHT_BOTTOM,

                                }
                            }}
                        >
                            {IsSearch && <Autocomplete
                                onLoad={onLoad}
                                onPlaceChanged={onPlaceChanged}
                            >

                                <div className="input-container">
                                    <input
                                        id='search-map'
                                        type="text"
                                        placeholder="ค้นหาพื้นที่"
                                        className='input-search-map'
                                        value={sInput}
                                        onChange={(e) => {
                                            setsInput(e.target.value);

                                        }}
                                    />
                                    <SearchIcon className="input-icon" />
                                </div>
                            </Autocomplete>}

                            {markerSearch != null && <Marker
                                position={{ lat: markerSearch?.lat, lng: markerSearch?.lng }}
                                draggable={false}
                                animation={google.maps.Animation.DROP}
                                onClick={async () => {
                                    await handleMarkerClick(9999, markerSearch);
                                }}
                            >
                                {IsPopUp && isOpen && infoWindowData?.id === 9999 && (
                                    PopUpInfoMap()
                                )}
                            </Marker>}

                            {IsMultiMarker && arrMarker.map((item, ind) => {
                                let sLabel = item.label === "1" ? "" : item.label;
                                let sKey = ind + "_" + item.lat
                                return (
                                    <Marker
                                        key={sKey}
                                        position={{ lat: item.lat, lng: item.lng }}
                                        animation={google.maps.Animation.DROP}
                                        draggable={false}
                                        label={sLabel}
                                        onClick={() => {
                                            handleMarkerClick(ind, item);
                                        }}
                                    >
                                        {isOpen && infoWindowData?.id === ind && (
                                            PopUpInfoMap()
                                        )}
                                    </Marker>
                                )
                            })}
                        </GoogleMap>

                    </>
                )
            }
        </div >
    )
}

export default MapCompoents
