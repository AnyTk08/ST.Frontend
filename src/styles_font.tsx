import React from 'react'
import { SxProps, styled } from "@mui/material"

export const MainHome: SxProps = {
    "*, ::after, ::before": {
    },
    ".section": {
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%",
        minHeight: "calc(100vh - var(--header-height))",
        paddingTop: "4vw",
        paddingBottom: "4vw",
        paddingLeft: "var(--site-padding-x)",
        paddingRight: "var(--site-padding-x)",
        backgroundAttachment: "fixed",
        backgroundPositionX: "center",
        backgroundPositionY: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
    },
    ".section .section-title": {
        display: "flex",
        alignItems: "center",
        fontSize: "2vw",
        textTransform: "uppercase",
        marginBottom: "1.5em",
    },
    ".section .section-title>.title-icon": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        width: "1.5em",
        height: "1.5em",
        color: "#ffffff",
        backgroundColor: "#1ca5fc",
        borderRadius: "50%",
    },
    ".section .section-title>.title-label": {
        color: "#444c5f",
        marginLeft: "0.5em",
    },
    ".section .section-headline": {
        fontSize: "1.25vw",
        lineHeight: "1.1",
        marginBottom: "1.25em",
    },
    ".section .section-caption": {
        fontWeight: "500",
        fontSize: "2.5vw",
        lineHeight: "1.1",
    },
    "@media (max-aspect-ratio: 16/9)": {
        ".section": {
            minHeight: "calc(100vw * 9 / 16)",
            backgroundAttachment: "local",
        }
    },
    "@media (max-width:1199px)": {
        ".section .section-title": {
            fontSize: "2.2vw",
        },
        ".section .section-headline": {
            fontSize: "1.375vw",
        },
        ".section .section-caption": {
            fontSize: "2.75vw",
        },
    },
    "@media (max-width:991px)": {
        ".section .section-title": {
            fontSize: "2.4vw",
        },
        ".section .section-headline": {
            fontSize: "1.5vw",
        },
        ".section .section-caption": {
            fontSize: "3vw",
        },
    },
    "@media (max-width:767px)": {
        ".section": {
            paddingTop: "3em",
            paddingBottom: "3em",
        },
        ".section .section-title": {
            fontSize: "1.5em",
        },
        ".section .section-headline": {
            fontSize: "1em",
        },
        ".section .section-caption": {
            fontSize: "1.875em",
        },
    },
    ".info-board": {
        width: "100%;",
        fontSize: "1.4vw;",
        lineHeight: "1.2;",
        marginBottom: "3em;",
    },
    ".info-board .info-cover": {
        height: "15vw;",
        marginBottom: "0.75em;",
        backgroundColor: "rgba(0, 0, 0, 0.1);",
        backgroundPositionX: "center;",
        backgroundPositionY: "center;",
        backgroundRepeat: "no-repeat;",
        backgroundSize: "100%;",
        borderRadius: "0.75em;",
    },
    ".info-board .info-headline": {
        color: " #252b48;",
        fontWeight: "500;",
        fontSize: "1.15em;",
        lineHeight: "1;",
        marginBottom: "0.5em;",
    },
    ".info-board .info-desc": {
        color: "#19435d;",
        fontSize: "0.9em;",
        marginTop: "1em;",
    },
    ".info-board .info-date": {
        color: "#1ca5fc;",
        fontSize: "0.8em;",
    },
    ".info-board .info-more": {
        display: " inline-block;",
        padding: "0.25em 0;",
        width: "6.5em;",
        textAlign: "center;",
        fontSize: "0.8em;",
        color: "#12171d;",
        backgroundColor: "#e6f2f6;",
        border: "1px solid #9ebddb;",
        borderRadius: "0.75em;",
        textDecoration: "none;",
    },
    ".info-board .info-more:hover": {
        backgroundColor: " #d9e4e8;"
    },
    ".info-board .info-main": {
        marginBottom: "30px;",
    },
    ".info-board .info-main .info-cover": {
        height: "25vw;",
        marginBottom: "0;",
    },
    ".info-board .info-main .info-headline ": {
        fontSize: "1.4em;"
    },
    ".info-board .info-main .info-more": {
        display: "block;",
        padding: "0.5em 0;",
        margin: "0.25em 0;",
        width: "7.5em;",
        textAlign: "center;",
        marginTop: "1.5em;",
    },
    ".info-board .info-item": {
        marginBottom: "30px;"
    },
    ".info-footer": {
        position: "absolute;",
        left: "0;",
        right: "0;",
        bottom: "0;",
        display: "flex;",
        alignItems: " center;",
        justifyContent: "end;",
        fontSize: "14vw;",
        minHeight: "0.5em;",
        paddingTop: "15px;",
        paddingBottom: "15px;",
        paddingLeft: "var(--site-padding-x);",
        paddingRight: "var(--site-padding-x);",
        backgroundColor: "#ffffff;",
    },
    "@media (max-width: 1199px)": {
        ".info-board": {
            fontSize: "1.5vw;",
        },
    },
    "@media (max-width: 991px)": {
        ".info-board": {
            fontSize: "1.6vw;",
        },
    },
    "@media (max-width: 767px)": {
        ".info-board": {
            fontSize: "1em;",
        },
        ".info-board .info-main .info-cover": {
            height: "35vw;",
            marginBottom: "0.75em;",
        },
        ".info-board .info-main .info-more": {
            display: "inline-block;",
            padding: "0.5em 0;",
            marginTop: "1em;",
        },
    },
    "@media (max-width: 575px)": {
        ".info-board .info-item .info-cover": {
            height: "35vw;",
        },
    },
    ".brand-list": {
        display: "flex;",
        flexWrap: "wrap;",
        alignItems: "center;",
        overflow: "hidden;",
    },
    ".brand-list>a": {
        position: "relative;",
        display: " flex;",
        justifyContent: "center;",
        alignItems: "center;",
        marginBottom: "-1px;",
    },
    ".brand-list>a:after": {
        content: '""',
        position: "absolute;",
        top: "0;",
        bottom: "0;",
        left: " 0;",
        right: "-1px;",
        borderRight: "1px solid rgba(0, 0, 0, 0.1);",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1);",
    },
    ".brand-list>a>img": {
        maxWidth: "50%;",
        maxHeight: "60%;",
    },


}