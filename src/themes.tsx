import { createTheme } from '@mui/material/styles';
import { blue, orange, pink, green } from '@mui/material/colors';

// or
const theme = createTheme({
    palette: {
        primary: {
            main: blue[700]
        },
        info: {
            main: "#5bc0de",
            light: "#46b8da",
            dark: "#00a5d6",
        },
    },
    typography: {
        "fontFamily": `"Helvetica",sans-serif`,
        "fontSize": 16,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                ".MuiDataGrid-main": {
                    // backgroundColor: orange[700],
                    // backgroundColor: "#d6d6d64d"
                },
                ".MuiDataGrid-columnHeaders": {
                    backgroundColor: '#5697fb',
                    display: "flex"
                },
                ".MuiDataGrid-row.Mui-selected": {
                    backgroundColor: "#bfd4ff3b !important",
                    // color:"white",
                    ".MuiCheckbox-root": {
                        color: "#002484!important",
                    }
                },
                ".MuiDataGrid-columnHeaderTitle": {
                    color: "white !important",
                    fontSize: "1.15rem"
                },
                ".MuiDataGrid-columnHeaderTitleContainer": {
                    ".MuiCheckbox-root": {
                        color: "white !important",
                        ".MuiCheckbox-root > Mui-checked": {
                            color: "white !important",
                        },
                    }
                },
                ".MuiDataGrid-columnSeparator": {
                    display: "flex",
                    height: "100%",
                    ".MuiDivider-root": {
                        height: "100%",
                        margin: "0 10px",
                        borderColor: "white",
                        opacity: '0 !important',
                    }
                },
                ".MuiDataGrid-columnHeader, .MuiDataGrid-columnHeader--alignCenter, .MuiDataGrid-columnHeader--sortable": {
                    backgroundColor: '#5697fb',
                    border: `1px solid rgba(224, 224, 224, 1)`,
                },

                ".MuiDataGrid-root.show-line": {
                    ".MuiDataGrid-row": {
                        ".MuiDataGrid-cell": {
                            position: "relative",
                            "::after": {
                                position: "absolute",
                                content: '""',
                                height: "100%",
                                width: "1px",
                                backgroundColor: "rgba(96, 96, 96, 0.12)",
                                '@media (max-width: 600px)': {
                                    backgroundColor: "rgb(96 96 96 / 0%)"
                                   },
                                right: "-2px"
                            }
                        },
                       
                    },
                     '@media (max-width: 600px)': {
                       width: (window.innerWidth /  1.35) + "px !important",
                      },
                      '@media (max-width: 500px)': {
                       width: (window.innerWidth /  1.45) + "px !important",
                      },
                      '@media (max-width: 400px)': {
                        width: (window.innerWidth /  1.55) + "px !important",
                       },
                       '@media (max-width: 350px)': {
                        width: (window.innerWidth /  1.85) + "px !important",
                       }
                      
                   
                },
                ".MuiDataGrid-footerContainer": {
                    overflow: "auto"
                },
                ".MuiDataGrid-row": {
                    backgroundColor: "#fff",
                    // minHeight: "39px !important",
                    "&:hover": {
                        backgroundColor: "#a7a7a769 !important",
                        // fontWeight: "bold",
                        // border: ".2px solid black",
                        // color: "#393939",
                        ".MuiCheckbox-root": {
                            color: "#002484 !important",
                        }
                    },
                    "&:nth-of-type(even)": {
                        background: "#f6f6f6",
                        "&:hover": {
                            // backgroundColor: "#f6f6f6 !important",
                            backgroundColor: "#a7a7a769 !important",
                        },
                    },
                },
                ".MuiDataGrid-virtualScrollerRenderZone": {
                    width: "100%",
                    // overflow: "hidden!important"
                },
                ".MuiDataGrid-virtualScroller": {
                    // overflow: "auto!important"
                },
                ".MuiDataGrid-virtualScrollerContent": {
                    fontSize: "1.1rem"
                },

                "@media only screen and (max-width:600px)": {
                    ".MuiDataGrid-virtualScrollerContent": {
                        width: "auto !important"
                    },
                    ".MuiDataGrid-columnHeaders": {
                        display: "none !important"
                    },
                    ".MuiDataGrid-virtualScroller": {
                        marginTop: "0px !important",
                        overflow: "hidden!important"
                    },


                    ".MuiDataGrid-row": {
                        borderBottom: "1px solid #f0f0f0",
                        counterReset: "n",
                        position: "relative",
                        flexDirection: "column !important",
                        width: "100% !important",
                        ".MuiDataGrid-cell": {
                            borderBottom: "none !important",
                            maxWidth: "none !important",
                            width: "100%",
                            justifyContent: "start !important",
                            alignItems: "start !important",
                            "::before": {
                                content: 'attr(data-columnname)',
                                width: "5em",
                                overflowWrap: "break-word"
                            }
                        },
                        ".MuiDataGrid-cell:not([data-columnname])": {
                            counterIncrement: "n",
                            position: "absolute",
                            width: "40px",
                            height: "40px",
                            minWidth: "0 !important",
                            bottom: "-7px;",
                            ".MuiButtonBase-root": {
                                width: "30px",
                                height: "30px",
                                minHeight: 0,
                                "svg": {
                                    fontSize: "18px"
                                }
                            }
                        },
                        ".MuiDataGrid-cell.checkbox-actions": {
                            position: "absolute",
                            width: "10px",
                            height: "10px",
                            minWidth: "0 !important",
                            top: -5,
                            left: -12,
                        },
                        ".cell-actions-0": {
                            right: "5px"
                        },
                        ".cell-actions-1": {
                            right: "55px"
                        },
                        ".cell-actions-2": {
                            right: "105px"
                        },
                        ".cell-actions-3": {
                            right: "155px"
                        },
                        ".cell-actions-4": {
                            right: "205px"
                        },

                        ".head-cell.MuiDataGrid-cell::before": {
                            fontWeight: "bold",
                        },
                        ".head-cell.MuiDataGrid-cell>div": {
                            fontWeight: "bold"
                        }
                    },

                    ".MuiDataGrid-row:has(.MuiDataGrid-cell:not([data-columnname]):not(.checkbox-actions))": {
                        paddingBottom: "4em"
                    },
                    ".MuiDataGrid-row:has(.MuiDataGrid-cell.checkbox-actions)": {
                        paddingLeft: "1.2em"
                    }
                },

                "label.MuiInputLabel-shrink": {
                    color: "#060606",
                    top: "0px",
                },
                "& .MuiInputBase-root.Mui-disabled": {
                    backgroundColor: '#ebe8e8 !important',
                    color: "rgba(0, 0, 0, 0.6) !important",
                    // color: '#4a4a4a !important',
                },
                "& .MuiFormLabel-root-MuiInputLabel-root.Mui-disabled": {
                    color: 'rgb(52 52 52) !important',
                },
                "& .MuiInputBase-input-MuiOutlinedInput-input:disabled": {
                    backgroundColor: '#ebe8e8 !important',
                    color: '#4a4a4a !important',
                    boxShadow: 'none',
                },
                "& .MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled":{
                    // -webkit-text-fill-color
                    WebkitTextFillColor: "rgba(0, 0, 0, 0.6) !important",
                    opacity:1,

                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: "10px",
                    // boxShadow: "rgba(116, 116, 116, 0.189) 0px 5px 15px",
                },
                input: {
                    color: '#363636',
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderRadius: "10px",
                    padding: "9px 10px",
                    '&.Mui-disabled': {
                        backgroundColor: '#ebe8e8 !important',
                        color: "#000000",
                        "WebkitTextFillColor": "#000000"
                        // WebkitTextFillColor
                        //-webkit-text-fill-color
                    },
                    '&.Mui-MuiInputLabel': {
                        color: "#000000",
                        "WebkitTextFillColor": "#000000"
                    },
                    // ":disabled": {
                    //     backgroundColor: '#ebe8e8 !important',
                    //     color: '#4a4a4a !important',
                    //     boxShadow: 'none',
                    // }
                }, 
                multiline: {
                    backgroundColor: "rgba(255,255,255,0.95)",
                    padding: 0,
                    input: {
                        padding: "4px",
                    },

                    ":disabled": {
                        backgroundColor: '#ebe8e8 !important',
                        color: '#4a4a4a !important',
                        boxShadow: 'none',
                    }
                },
            }
        }, MuiAutocomplete: {
            styleOverrides: {
                root: {
                    borderRadius: "10px",
                    backgroundColor: "rgba(255,255,255,0.95)",
                },
                input: {
                    color: '#363636',
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderRadius: "10px",

                    ":disabled": {
                        backgroundColor: '#ebe8e8 !important',
                        color: '#4a4a4a !important',
                        boxShadow: 'none',
                    }
                }
            }
        }, MuiFormControl: {
            styleOverrides: {
                root: {
                    borderRadius: "20px",
                    backgroundColor: "rgba(255,255,255,0.95)",
                },
            }
        }, MuiButtonBase: {
            styleOverrides: {
                root: {
                    zIndex: 1
                },
            }
        }, MuiSelect: {
            styleOverrides: {
                outlined: {
                    backgroundColor: "transparent",
                },
            }
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    '&.Mui-disabled': {
                        color: "#000000",
                        // : "#dcdcdc80"
                    },
                    "&::placeholder": {
                        color: "gray"
                      },
                },
            }
        },
        MuiFormControlLabel: {
            styleOverrides: {
                label: {
                    '&.Mui-disabled': {
                        color: "#000000 !important",
                    },
                },
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    '&.Mui-disabled': {
                        color: "#000000",
                    },
                },
                shrink: {
                    top: "0px",
                    fontSize: '1.2rem !important'
                    // backgroundColor: '#e9e6e6',
                }
            }
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontSize: '1.25rem'
                },
            }
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    fontSize: '1rem'
                },
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#f8f8f847'
                },
            }
        }
    },

});
export default theme;