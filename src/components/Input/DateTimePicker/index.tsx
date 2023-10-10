import { useState, forwardRef, useCallback, useEffect, Fragment } from "react";
import { FormControl, FormHelperText, TextField, Stack, IconButton, InputAdornment } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import moment from 'moment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { language } from "config/AppConfig";
import { DatePickerFromProps, DatePickerNoFromProps, DateRangePickerFromProp, DateRangePickerProFromProps } from "./DatePickerProps";
import { DatePicker, } from "@mui/x-date-pickers"; //LocalizationProvider
import { AiOutlineMinus } from "react-icons/ai";

//#region Date Range Picker PRO
import { LicenseInfo } from '@mui/x-license-pro';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import EventIcon from '@mui/icons-material/Event';
//#endregion

const localeMap = (language) => {
    switch (language) {
        case "th":
            moment.locale('th');
            break;
        case "en":
            moment.locale('en');
            break;
        default:
            break;
    }
};

/** class CustomAdapter */
class CustomAdapter extends AdapterMoment {
    constructor({ locale, formats, instance }) {
        super({ locale, formats, instance });
    }

    calYear(moment) {
        switch (this.locale) {
            case "th":
                return (parseInt(moment.format('YYYY')) + 543).toString();
            case "en":
                return parseInt(moment.format('YYYY'));
            default:
                return parseInt(moment.format('YYYY'));
        }
    }

    renderLabel(moment, format) {
        switch (format) {
            case "year":
                return this.calYear(moment);
            case "month":
                return moment.format("MMMM");
            case "fullDate":
                return moment.format("DDMMYYYY");
            case "dayOfMonth":
                return moment.format("D");
            case "monthShort":
                return moment.format("MMMM");
            case "monthAndYear":
                return `${moment.format("MMMM ")} ${this.calYear(moment)}`;
            case "normalDate":
                return `${moment.format("dd")} ${moment.format("MMM")} ${moment.format("D")}`;
            default:
                return moment.format(format);
        }
    }
    startOfMonth = (date) => date ? date.clone().startOf("month") : moment(new Date());

    format = (date, formatKey) => {
        return date ? this.renderLabel(date, formatKey) : moment(new Date());
    };
}

export const DatePickerFromItem = forwardRef((props: DatePickerFromProps, ref) => {
    const { name, fullWidth = false, format = "DD/MM/YYYY", isMessageError, isShowIcon = true,onDisableDay, IsShrink = true } = props;
    const minDate = props.minDate ?? null;
    const maxDate = props.maxDate ?? null;
    const required = props.required ?? false;
    const disabled = props.disabled ?? false;
    const view = props.view ?? ['year', 'month', 'day'];
    const { control, } = useFormContext();
    const formatDefalut = format;
    const [open, setOpen] = useState(false);
    const [locale] = useState(language);

    /** funtion **/
    const ReplaceThFormat = (text) => {
        return text ? text.toLowerCase().replaceAll("d", "ว").replaceAll("m", "ด").replaceAll("y", "ป") : "";
    }

    const maskMap = {
        en: formatDefalut,
        th: ReplaceThFormat(formatDefalut),
    };

    const [objCheckReplace] = useState(() => {
        localeMap(locale);
        let objReturn = { isReplaceYear: false, indexArr: 0, splitText: "" };
        let formatLower = formatDefalut ? formatDefalut.toLowerCase() : "";
        if (formatLower.includes("YYYY")) {
            let splitText = (formatDefalut.substr(formatLower.indexOf("YYYY") - 1, 1)).toLowerCase();
            if (splitText !== "Y") {
                objReturn.splitText = splitText;
                objReturn.indexArr = formatLower.split(splitText).findIndex((e) => e === "YYYY");
            }
            objReturn.isReplaceYear = true;
        }
        return objReturn;
    });

    const getmoment = useCallback((params, value) => {

        if (locale === "th") {
            if (params.inputProps.value) {
                let convertDateToString: string = moment(value).format(format);
                let year = objCheckReplace.splitText ? convertDateToString.split(objCheckReplace.splitText)[objCheckReplace.indexArr] : convertDateToString.substr(6, 4);
                let addyear = parseInt(year) + 543;
                let replaceAllFormat = format.replaceAll("YYYY", "");
                params.inputProps.value = moment(value).format(replaceAllFormat) + addyear;
            }
        }

    }, [])

    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { invalid, error }, }) => (
                <LocalizationProvider
                    locale={"th"}
                    dateAdapter={CustomAdapter}
                >
                    <FormControl
                        fullWidth={fullWidth}
                        sx={{
                            "label.MuiInputLabel-shrink": {
                                //backgroundColor: "rgba(255,255,255,0.95)",
                                top: "0px",
                            },
                            ".MuiInputLabel-outlined": {
                                top: "0px",
                            },
                            ".MuiInputLabel-asterisk": {
                                color: "red"
                            }
                        }}
                    >
                        <DatePicker
                            key={name}
                            dayOfWeekFormatter={(day) => day.charAt(0).toUpperCase() === "เ" ? "ส" : day.charAt(0).toUpperCase()}
                            inputRef={ref}
                            value={value ? moment(value, formatDefalut) : null}
                            onChange={(e, key) => {
                                let s = moment(e).isValid();
                                if (s !== false) {
                                    let dInfo: Date = e;
                                    onChange(dInfo);
                                    if(props.onChange){
                                        props.onChange(dInfo);
                                    }
                                }
                                else {
                                    onChange(null);
                                    if(props.onChange){
                                        props.onChange(null);
                                    }
                                }
                            }}
                            shouldDisableDate={onDisableDay}
                            open={open}
                            onOpen={() => {if(!props.disabled){setOpen(true)}} }
                            onClose={() => setOpen(false)}
                            minDate={minDate}
                            maxDate={maxDate}
                            label={props.label}
                            inputFormat={formatDefalut}
                            disabled={disabled}
                            views={view}
                            showToolbar={false}
                            DialogProps={{ sx: { '& .PrivateDatePickerToolbar-penIcon,& .MuiPickersToolbar-penIconButton': { display: 'none' } } }}
                            renderInput={(params) => {
                                params.inputProps.placeholder = maskMap[locale];
                                getmoment(params, value);
                                
                                return (
                                    <TextField
                                        {...params}
                                        sx={{
                                            ".MuiOutlinedInput-root": {
                                                padding: isShowIcon ? "0px 15px 0px 0px!important" : "0px !important",
                                                " fieldset > legend > span": {
                                                    padding: "0px !important",
                                                },
                                            },
                                            fontWeight: 600,
                                        }}
                                        size={"small"}
                                        label={props.label}
                                        name={name}
                                        error={error?.message != null}
                                        required={required}
                                        disabled={disabled}
                                        value={params.inputProps.value || ""}
                                        autoComplete={"off"}
                                        onClick={() => {if(!props.disabled){setOpen(true)}} }
                                        InputLabelProps={{ shrink: IsShrink ? true : undefined, }}
                                    />
                                )
                            }}
                        />
                        {isMessageError && error ? (
                            <FormHelperText sx={{ color: "red" }}>
                                {error.message}
                            </FormHelperText>
                        ) : null}
                    </FormControl>
                </LocalizationProvider>
            )
            }
        />
    );

});
export default DatePickerFromItem;

export const DatePickerNoFromItem = forwardRef((props: DatePickerNoFromProps, ref) => {
    const { id, fullWidth = false, format = "DD/MM/YYYY", isShowIcon = true, IsShrink = true, } = props;
    const minDate = props.minDate ?? null;
    const maxDate = props.maxDate ?? null;
    const disabled = props.disabled ?? false;
    const view = props.view ?? ['year', 'month', 'day'];
    const formatDefalut = format;
    const [open, setOpen] = useState(false);
    const [locale] = useState(language);
    const [value, setValue] = useState<any>(props.value);

    /** funtion */

    const ReplaceThFormat = (text) => {
        return text ? text.toLowerCase().replaceAll("d", "ว").replaceAll("m", "ด").replaceAll("y", "ป") : "";
    }

    const maskMap = {
        en: formatDefalut,
        th: ReplaceThFormat(formatDefalut),
    };

    const [objCheckReplace] = useState(() => {
        localeMap(locale);
        let objReturn = { isReplaceYear: false, indexArr: 0, splitText: "" };
        let formatLower = formatDefalut ? formatDefalut.toLowerCase() : "";
        if (formatLower.includes("yyyy")) {
            let splitText = (formatDefalut.substr(formatLower.indexOf("yyyy") - 1, 1)).toLowerCase();
            if (splitText !== "y") {
                objReturn.splitText = splitText;
                objReturn.indexArr = formatLower.split(splitText).findIndex((e) => e === "yyyy");
            }
            objReturn.isReplaceYear = true;
        }
        return objReturn;
    });

    const getmoment = useCallback((params, value) => {

        if (locale === "th") {
            if (params.inputProps.value) {
                let convertDateToString: string = moment(value).format(format);
                let year = objCheckReplace.splitText ? convertDateToString.split(objCheckReplace.splitText)[objCheckReplace.indexArr] : convertDateToString.substr(6, 4);
                let addyear = parseInt(year) + 543;
                let replaceAllFormat = format.replaceAll("YYYY", "");
                params.inputProps.value = moment(value).format(replaceAllFormat) + addyear;
            }
        }
    }, [])

    return (
        <LocalizationProvider
            locale={language}
            dateAdapter={CustomAdapter}
        >
            <FormControl
                fullWidth={fullWidth}
                sx={{
                    "label.MuiInputLabel-shrink": {
                        // backgroundColor: "rgba(255,255,255,0.95)",
                        top: "0px",
                    },
                    ".MuiInputLabel-outlined": {
                        top: "0px",
                    },
                    ".MuiInputLabel-asterisk": {
                        color: "red"
                    }
                }}
            >
            <DatePicker
                dayOfWeekFormatter={(day) => day.charAt(0).toUpperCase() === "เ" ? "ส" : day.charAt(0).toUpperCase()}
                // inputRef={ref}
                value={value || null}
                onChange={(e, key) => {
                    let s = moment(e).isValid();
                    if (s !== false) {
                        let dInfo: Date = e;
                        setValue(dInfo)
                        if(props.onChange){
                            props.onChange(dInfo);
                        }
                    }
                    else {
                        setValue(null);
                        if(props.onChange){
                            props.onChange(null);
                        }
                    }
                }}
                open={open}
                onOpen={() => {if(!props.disabled){setOpen(true)}} }
                onClose={() => setOpen(false)}
                minDate={minDate}
                maxDate={maxDate}
                label={props.label}
                inputFormat={formatDefalut}
                disabled={disabled}
                views={view}
                showToolbar={false}
                DialogProps={{ sx: { '& .PrivateDatePickerToolbar-penIcon,& .MuiPickersToolbar-penIconButton': { display: 'none' } } }}
                renderInput={(params) => {
                    params.inputProps.placeholder = maskMap[locale];
                    getmoment(params, value);

                    return (
                        <TextField
                            {...params}
                            sx={{
                                ".MuiOutlinedInput-root": {
                                    padding: isShowIcon ? "0px 15px 0px 0px!important" : "0px !important",
                                    " fieldset > legend > span": {
                                        padding: "0px !important",
                                    },
                                },
                                fontWeight: 600,
                            }}
                            size={"small"}
                            label={props.label}
                            name={id}
                            // error={error?.message != null}
                            disabled={disabled}
                            // value={value || ""}
                            value={params.inputProps.value || ""}
                            autoComplete={"off"}
                            onClick={() => {if(!props.disabled){setOpen(true)}} }
                            InputLabelProps={{ shrink: IsShrink ? true : undefined, }}
                        />
                    )
                }}
            />
            </FormControl>
        </LocalizationProvider>
    );

});

export const DateTimePickerFromItem = forwardRef((props: DatePickerFromProps, ref) => {

    return (<>
    </>)

});

export const DateRangePickerFrom = forwardRef((props: DateRangePickerFromProp, ref) => {
    const {
        getValues,
        setValue,
        watch,
        setError,
    } = useFormContext();

    useEffect(() => {
        if (getValues(props.nameStart)) {
            if (getValues(props.nameEnd) < getValues(props.nameStart)) {
                setValue(props.nameEnd, null);
                setError(props.nameEnd, { type: "validate" }, { shouldFocus: false });
            }
        }

        let objDate = {dStart: watch(props.nameStart), dEnd: watch(props.nameEnd)};
        if(props.onChange)
        {
            props.onChange(objDate);

        }
    }, [watch(props.nameStart)])

    useEffect(() => {
        if (getValues(props.nameEnd)) {
            if (getValues(props.nameEnd) < getValues(props.nameStart)) {
                setValue(props.nameStart, null);
                setError(props.nameStart, { type: "validate" }, { shouldFocus: false });
            }
        }

        let objDate = {dStart: watch(props.nameStart), dEnd: watch(props.nameEnd)};
        if(props.onChange){
            props.onChange(objDate);
        }
    }, [watch(props.nameEnd)])

    return (
        <div style={{ display: "flex" }}>
            <DatePickerFromItem
                id={props.nameStart}
                name={props.nameStart || ""}
                label={props.labelStart}
                {...props}
                required={props.required}
                fullWidth={true}
                minDate={props.minDateStart}
                // maxDate={props.maxDateEnd ? props.maxDateEnd : (props.view || []).length == 1 && (props.view || []).filter(f => f == "year").length > 0 ? getValues(props.nameEnd) + "" : getValues(props.nameEnd)}
                maxDate={getValues(props.nameEnd) ?? props.maxDateEnd}
            />
            <p style={{ display: "flex", alignItems: 'center' }}><AiOutlineMinus /></p>
            {/* <p style={{ padding: "0px", marginTop: "9px", paddingLeft: "10px", paddingRight: "10px", display: "flex" }}><AiOutlineMinus style={{ marginTop: "4px" }} /></p> */}
            <DatePickerFromItem
                id={props.nameEnd}
                name={props.nameEnd || ""}
                label={props.labelEnd}
                {...props}
                required={props.required}
                fullWidth={true}
                // minDate={props.minDateStart ? props.minDateStart : (props.view || []).length == 1 && (props.view || []).filter(f => f == "year").length > 0 ? getValues(props.nameStart) + "" : getValues(props.nameStart)}
                minDate={getValues(props.nameStart) ?? props.minDateStart}
                maxDate={props.maxDateEnd}
            />
        </div>
    )
});

export const DateRangePickerProFrom = forwardRef((props: DateRangePickerProFromProps, ref) => {

    LicenseInfo.setLicenseKey('049fdd25559575ef04f65a9e1ed5aabaTz02NDk0MCxFPTE3MTM2NzY2MjYyNzIsUz1wcm8sTE09cGVycGV0dWFsLEtWPTI=');

    const {
        name,
        format = "DD/MM/YYYY",
        minDate,
        maxDate,
        defaultCalendarMonth = null,
        labelStart = "",
        labelEnd = "",
        required = false,
        calendarsCount = 2,
        disabled = false,
        disablePast = false,
        IsShrink = true,
    } = props;

    const {
        register,
        control,
        formState: { errors },
    } = useFormContext();

    const [locale] = useState<keyof typeof maskMap>(language);
    const ReplaceThFormat = (text: string) => { text.toLowerCase().replaceAll("d", "ว").replaceAll("m", "ด").replaceAll("y", "ป"); }

    const formatDefalut = format;
    const maskMap = {
        en: formatDefalut,
        th: ReplaceThFormat(formatDefalut),
    };

    const [objCheckReplace] = useState(() => {
        localeMap(locale);
        let objReturn = { isReplaceYear: false, indexArr: 0, splitText: "" };
        var formatLower = formatDefalut.toLowerCase();
        if (formatLower.includes("yyyy")) {
            var splitText = (formatDefalut.substr(formatLower.indexOf("yyyy") - 1, 1)).toLowerCase();
            if (splitText !== "y") {
                objReturn.splitText = splitText;
                objReturn.indexArr = formatLower.split(splitText).findIndex((e) => e === "yyyy");
            }
            objReturn.isReplaceYear = true;
        }
        return objReturn;
    });

    const onSetMomentLocale = useCallback((startProps: any, endProps: any) => {
        if (locale === "th") {
            //Start
            if (startProps.inputProps.value && objCheckReplace.isReplaceYear && startProps.inputProps.value.length === 10) {
                let year = objCheckReplace.splitText ? startProps.inputProps.value.split(objCheckReplace.splitText)[objCheckReplace.indexArr] : startProps.inputProps.value.substr(0, 4);
                let addyear = parseInt(year) > 2500 ? parseInt(year) : parseInt(year) + 543;
                startProps.inputProps.value = startProps.inputProps.value.replaceAll(`${year}`, `${addyear}`);   //ปิดเพราะทำให้พิมพ์แล้ว error
            }
            else if (format === "YYYY" && startProps.inputProps.value && objCheckReplace.isReplaceYear && startProps.inputProps.value.length === 4) {
                let addyear = parseInt(startProps.inputProps.value) > 2500 ? parseInt(startProps.inputProps.value) : parseInt(startProps.inputProps.value) + 543;
                startProps.inputProps.value = addyear;
            }
            //End
            if (endProps.inputProps.value && objCheckReplace.isReplaceYear && endProps.inputProps.value.length === 10) {
                let year = objCheckReplace.splitText ? endProps.inputProps.value.split(objCheckReplace.splitText)[objCheckReplace.indexArr] : endProps.inputProps.value.substr(0, 4);
                let addyear = parseInt(year) > 2500 ? parseInt(year) : parseInt(year) + 543;
                endProps.inputProps.value = endProps.inputProps.value.replaceAll(`${year}`, `${addyear}`);   //ปิดเพราะทำให้พิมพ์แล้ว error
            }
            else if (format === "YYYY" && endProps.inputProps.value && objCheckReplace.isReplaceYear && endProps.inputProps.value.length === 4) {
                let addyear = parseInt(endProps.inputProps.value) > 2500 ? parseInt(endProps.inputProps.value) : parseInt(endProps.inputProps.value) + 543;
                endProps.inputProps.value = addyear;
            }
        }
    }, [])

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={[null, null]}
            key={name}
            render={({
                field: { onChange, onBlur, value, ref },
            }) => (
                <LocalizationProvider
                    locale={locale}
                    dateAdapter={CustomAdapter}
                >
                    <DateRangePicker
                        {...register(name)}
                        value={value}
                        onChange={(e)=> {
                            onChange(e);
                            if(props.onChange){
                                props.onChange(e);
                            }
                        }}
                        components={{
                            OpenPickerIcon: EventIcon,
                        }}
                        disabled={disabled}
                        defaultCalendarMonth={defaultCalendarMonth}
                        inputFormat={format}
                        minDate={minDate || null}
                        maxDate={maxDate || null}
                        calendars={calendarsCount}
                        PopperProps={{
                            //App bar nested
                            sx: {
                                zIndex: 10
                            }
                        }}
                        disablePast={disablePast}
                        renderInput={(startProps, endProps) => {
                            startProps.inputProps.placeholder = "วว/ดด/ปปปป";
                            endProps.inputProps.placeholder = "วว/ดด/ปปปป";
                            onSetMomentLocale(startProps, endProps)
                            return (
                                renderTextfield(startProps, endProps)
                            )
                        }}
                    />
                    {errors && errors[name] ? (
                        <FormHelperText sx={{ color: "red" }}>
                            {errors[name].message + ""}
                        </FormHelperText>
                    ) : null}
                </LocalizationProvider>
            )
            }
        />
    )

    function renderTextfield(startProps, endProps): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
        return (
            <Fragment>
                <>
                    <Stack style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <TextField
                            disabled={disabled}
                            size={"small"}
                            inputRef={register(name).ref[0]}
                            {...startProps}
                            error={errors != null && errors[name] != null}
                            fullWidth
                            required={required}
                            label={labelStart}
                            autoComplete="off"
                            // onClick={() => setOpenPicker(true)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            // onClick={() => setOpenPicker(true)}
                                            style={{
                                                marginRight: '-15px'
                                            }}
                                        >
                                            <EventIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{shrink: IsShrink ? true : undefined,}}
                            sx={{
                                "label.MuiInputLabel-shrink": {
                                    // backgroundColor: "rgba(255,255,255,0.95)",
                                    top: "0px",
                                },
                                ".MuiInputLabel-outlined": {
                                    top: "0px",
                                },
                                ".MuiInputLabel-asterisk": {
                                    color: "red"
                                }
                            }} />
                    </Stack>
                    <p style={{ padding: "0px", marginTop: "9px", paddingLeft: "10px", paddingRight: "10px", display: "flex" }}><AiOutlineMinus style={{ marginTop: "4px" }} /></p>
                    <Stack style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <TextField
                            disabled={disabled}
                            size={"small"}
                            inputRef={register(name).ref[1]}
                            {...endProps}
                            error={errors != null && errors[name] != null}
                            // onClick={() => setOpenPicker(true)}
                            required={required}
                            label={labelEnd}
                            autoComplete="off"
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            // onClick={() => setOpenPicker(true)}
                                            style={{
                                                marginRight: '-15px'
                                            }}
                                        >
                                            <EventIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{shrink: IsShrink ? true : undefined,}}
                            sx={{
                                "label.MuiInputLabel-shrink": {
                                    // backgroundColor: "rgba(255,255,255,0.95)",
                                    top: "0px",
                                },
                                ".MuiInputLabel-outlined": {
                                    top: "0px",
                                },
                                ".MuiInputLabel-asterisk": {
                                    color: "red"
                                }
                            }} />
                    </Stack>
                </>
            </Fragment>
        )
    }
});