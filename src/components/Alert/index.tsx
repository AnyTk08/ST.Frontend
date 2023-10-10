import React from 'react'
import Swal, { SweetAlertIcon } from 'sweetalert2'
import {AlertTitle} from 'config/AlertMsgConfig'
import i18n from 'config/i18nConfig';

export const AlertIcon = {
    info: "info" as SweetAlertIcon,
    success: "success" as SweetAlertIcon,
    error: "error" as SweetAlertIcon,
    warning: "warning" as SweetAlertIcon,
    question: "question" as SweetAlertIcon,
};

export const AlertButtonText = {
    OK: i18n.t("ok"),
    Cancel: i18n.t("cancel"),
    Close: i18n.t("close"),
    Yes: i18n.t("yes"),
    No: i18n.t("no"),
    Confirm: i18n.t("confirm")
};


const SwAlert_Title = (sTitle: string) => {
    return "<strong>" + sTitle + "</strong>";
};

export const SwAlert = {
    Common: (sTitle: string | undefined, sMessage: string, fnOK?: Function) => {
        Swal.fire({
            title: SwAlert_Title(!sTitle ? "" : sTitle + ""),
            html: sMessage,
            confirmButtonText: AlertButtonText.Close,
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.value) {
                if (fnOK) fnOK();
            }
        });
    },
    Info: (sTitle: string | undefined, sMessage: string, fnOK?: Function) => {
        Swal.fire({
            title: SwAlert_Title(!sTitle ? AlertTitle.Success : sTitle + ""),
            html: sMessage,
            icon: AlertIcon.info,
            confirmButtonText: AlertButtonText.Close,
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.value) {
                if (fnOK) {
                    fnOK();
                } else {
                    Swal.close();
                }
            }
        });
    },
    Success: (sTitle: string | undefined, sMessage: string, fnOK?: Function) => {
        Swal.fire({
            title: SwAlert_Title(!sTitle ? AlertTitle.Success : sTitle + ""),
            html: sMessage,
            icon: AlertIcon.success,
            confirmButtonText: AlertButtonText.Close,
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.value) {
                if (fnOK) {
                    fnOK();
                } else {
                    Swal.close();
                }
            }
        });
    },
    Error: (sTitle: string | undefined, sMessage: string, fnOK?: Function) => {
        Swal.fire({
            icon: AlertIcon.error,
            title: SwAlert_Title(!sTitle ? AlertTitle.Error : sTitle + ""),
            html: sMessage,
            confirmButtonText: AlertButtonText.Close,
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.value) {
                if (fnOK) {
                    fnOK();
                } else {
                    Swal.close();
                }
            }
        });
    },
    Warning: (sTitle: string | undefined, sMessage: string, fnOK?: Function) => {
        Swal.fire({
            icon: AlertIcon.warning,
            title: SwAlert_Title(!sTitle ? AlertTitle.Warning : sTitle + ""),
            html: sMessage,
            confirmButtonText: AlertButtonText.Close,
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.value) {
                if (fnOK) {
                    fnOK();
                } else {
                    Swal.close();
                }
            }
        });
    },
    Confirm: (
        sTitle: string | undefined,
        sMessage: string,
        fnYes?: Function,
        fnNo?: Function
    ) => {
        Swal.fire({
            title: SwAlert_Title(!sTitle ? AlertTitle.Confirm : sTitle + ""),
            html: sMessage,
            icon: AlertIcon.question,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: AlertButtonText.OK,
            cancelButtonText: AlertButtonText.Cancel,
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: () => {
                return new Promise(() => {
                    //resolve, reject
                    Swal.showLoading(Swal.getDenyButton());

                    if (fnYes) {
                        fnYes();
                        Swal.close();
                    } else {
                        Swal.close();
                    }
                });
            },
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
                if (fnNo) {
                    fnNo();
                    Swal.close();
                } else {
                    Swal.close();
                }
            }
        });
    },
    ConfirmYN: (
        sTitle: string | undefined,
        sMessage: string,
        fnYes?: Function,
        fnNo?: Function
    ) => {
        Swal.fire({
            title: SwAlert_Title(!sTitle ? AlertTitle.Confirm : sTitle + ""),
            html: sMessage,
            icon: AlertIcon.question,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: AlertButtonText.Yes,
            cancelButtonText: AlertButtonText.No,
        }).then((result) => {
            if (result.value) {
                if (fnYes) fnYes();
                else Swal.close();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                if (fnNo) fnNo();
                else Swal.close();
            }
        });
    },
    HtmlWarning: (sTitle: string | undefined, sMessage: string, fnOK?: Function) => {
        Swal.fire({
            icon: AlertIcon.warning,
            title: SwAlert_Title(!sTitle ? AlertTitle.Warning : sTitle + ""),
            html: sMessage,
            confirmButtonText: AlertButtonText.Close,
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.value) {
                if (fnOK) {
                    fnOK();
                } else {
                    Swal.close();
                }
            }
        });
    },
};