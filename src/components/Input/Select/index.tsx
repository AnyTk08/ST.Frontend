import React, { useState, forwardRef, useCallback, Fragment, useEffect } from "react";
import { SelectFromProps, SelectNoFromProps, FilmOptionType, SelectGroupFromProps } from './SelectProps';
import { useFormContext, Controller } from "react-hook-form";
import { Autocomplete, TextField, FormHelperText, Popper, createFilterOptions, Tooltip, Typography, Box, Chip, ListItem, ListItemButton, Collapse, List, } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { ParseHtml } from "utilities/ST_Function";
import { useTranslation } from 'react-i18next';
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import secureLocalStorage from "react-secure-storage";

const filter = createFilterOptions<FilmOptionType>();
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const SelectFormItem = forwardRef((props: SelectFromProps, ref) => {
    const {
        name,
        fullWidth = true,
        isMessageError = true,
        isClearable = false,
        disabled = false,
        isPopperCustom = true,
    } = props;

    const {
        control,
    } = useFormContext();

    const [t] = useTranslation();
    const PopperCustom = useCallback((props) => {
        return <Popper
            {...props}
            placement='bottom-start'
            disablePortal={true}
            modifiers={[
                {
                    name: 'flip',
                    enabled: false,
                    options: {
                        altBoundary: true,
                        rootBoundary: 'document',
                        padding: 8,
                    },
                },
            ]}
        />;
    }, []);

    const getOpObjValue = (val) => {
        let res = null;
        if (val) res = props.options.find(op => op.value === val);
        return res;
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { invalid, error } }) => {
                return (
                    <>
                        <Autocomplete
                            {...ref}
                            ref={ref}
                            id={props.name}
                            disabled={disabled}
                            PopperComponent={isPopperCustom ? PopperCustom : undefined}
                            fullWidth={fullWidth}
                            size={"small"}
                            options={props.options || []}
                            value={getOpObjValue(value)}
                            noOptionsText={props.notOptionsText || t("noInformationFound")}
                            disableClearable={isClearable}
                            renderOption={(props, option: any) => {
                                return (
                                    <li {...props} key={option.value} style={option.color ? { backgroundColor: option.color } : {}}>
                                         <span style={option.fontColor ? {color : option.fontColor} : {}}>{option.label}</span>
                                    </li>
                                );
                            }}
                            filterOptions={(options, params) => {
                                const filtered = params.inputValue ? options.filter((f: any) => f.label.toLowerCase().includes(params.inputValue.toLowerCase())) : options;
                                return props.nLimits != null ? filtered.slice(0, props.nLimits) : filtered;
                            }}
                            getOptionLabel={(itemOption: any) => {
                                return `${itemOption?.label}`
                            }}
                            renderInput={(params) => {
                                let TooltipTitle = null;
                                if (disabled) {
                                    TooltipTitle = params.inputProps.value;
                                }
                                return (
                                    <Tooltip title={ParseHtml(TooltipTitle)} disableHoverListener={TooltipTitle ? false : true} disableFocusListener>
                                        <TextField
                                            {...params}
                                            name={name}
                                            error={error?.message != null}
                                            required={props.required}
                                            disabled={disabled}
                                            label={props.label}
                                            placeholder={props.placeholder}
                                            size={"small"}
                                            fullWidth={fullWidth}
                                            style={props.style}
                                            InputProps={{
                                                ...params.InputProps,
                                            }}
                                            sx={{
                                                "label.MuiInputLabel-shrink": {
                                                    top: "0px",
                                                },
                                                ".MuiInputLabel-outlined": {
                                                    top: "0px",
                                                },
                                                ".MuiInputLabel-asterisk": {
                                                    color: "red"
                                                }
                                            }}
                                        />
                                    </Tooltip>
                                )
                            }}
                            onChange={(event, value) => {
                                onChange(value != null ? value["value"] : null);
                                if (props.onChange) {
                                    props.onChange(value, event);
                                }
                            }}
                            onBlur={(event) => {
                                onBlur();
                                if (props.onBlur) {
                                    props.onBlur(event);
                                }
                            }}
                            onKeyPress={(event) => {
                                if (props.onKeyPress) {
                                    props.onKeyPress(event);
                                }
                            }}
                            onKeyDown={(event) => {
                                if (props.onKeyDown) {
                                    props.onKeyDown(event)
                                }
                            }}
                            onKeyUp={(event) => {
                                if (props.onKeyUp) {
                                    props.onKeyUp(event);
                                }
                            }}
                        />
                        {isMessageError && error ? (
                            <FormHelperText sx={{ color: "red" }}>
                                {error.message}
                            </FormHelperText>
                        ) : null}
                    </>
                )
            }
            }
        />
    );
});
export default SelectFormItem;

export const SelectNoFormItem = forwardRef((props: SelectNoFromProps, ref) => {
    const {
        fullWidth = true,
        isClearable = false,
        disabled = false,
        isPopperCustom = true,
    } = props;

    const [t] = useTranslation();
    const [value, setValue] = useState<string>(props.value);

    const PopperCustom = useCallback((props) => {
        return <Popper
            {...props}
            placement='bottom-start'
            disablePortal={true}
            modifiers={[
                {
                    name: 'flip',
                    enabled: false,
                    options: {
                        altBoundary: true,
                        rootBoundary: 'document',
                        padding: 8,
                    },
                },
            ]}
        />;
    }, []);

    const getOpObjValue = (val) => {
        let res = null;
        if (val) res = props.options.find(op => op.value === val);
        return res;
    };

    return (
        <Autocomplete
            ref={ref}
            id={props.id}
            disabled={disabled}
            PopperComponent={isPopperCustom ? PopperCustom : undefined}
            fullWidth={fullWidth}
            size={"small"}
            options={props.options ?? []}
            value={getOpObjValue(value)}
            noOptionsText={props.notOptionsText ?? t("noInformationFound")}
            disableClearable={isClearable}
            renderOption={(props, option: any) => {
                return (
                    <li {...props} key={option.value} style={option.color ? { backgroundColor: option.color } : {}}>
                        {option.label}
                    </li>
                );
            }}
            filterOptions={(options, params) => {
                const filtered = params.inputValue ? options.filter((f: any) => f.label.toLowerCase().includes(params.inputValue.toLowerCase())) : options;
                return props.nLimits != null ? filtered.slice(0, props.nLimits) : filtered;
            }}
            getOptionLabel={(itemOption: any) => {
                return `${itemOption?.label}`
            }}
            isOptionEqualToValue={(option, value) =>
                option.value === value.value
            }
            renderInput={(params) =>
                <TextField
                    {...params}
                    name={props.id}
                    disabled={disabled}
                    label={props.label}
                    placeholder={props.placeholder}
                    size={"small"}
                    fullWidth={fullWidth}
                    style={props.style}
                    InputProps={{
                        ...params.InputProps,
                    }}
                    sx={{
                        "label.MuiInputLabel-shrink": {
                            top: "0px",
                        },
                        ".MuiInputLabel-outlined": {
                            top: "0px",
                        },
                        ".MuiInputLabel-asterisk": {
                            color: "red"
                        }
                    }}
                />
            }
            onChange={(event, value) => {
                setValue(value != null ? value["value"] : null)
                if (props.onChange) {
                    props.onChange(value, event);
                }
            }}
            onBlur={(event) => {
                if (props.onBlur) {
                    props.onBlur(event);
                }
            }}
            onKeyPress={(event) => {
                if (props.onKeyPress) {
                    props.onKeyPress(event);
                }
            }}
            onKeyDown={(event) => {
                if (props.onKeyDown) {
                    props.onKeyDown(event)
                }
            }}
            onKeyUp={(event) => {
                if (props.onKeyUp) {
                    props.onKeyUp(event);
                }
            }}
        />
    )
});

export const SelectMultipleFormItem = forwardRef((props: SelectFromProps, ref) => {
    const {
        name,
        fullWidth = true,
        nlimitTags = 2,
        isSelectAll = true,
        isClearable = false,
        disabled = false,
        isMessageError = true,
        isPopperCustom = true,
    } = props;

    const {
        setValue,
        control,
    } = useFormContext();

    const [t] = useTranslation();
    const PopperCustom = useCallback((props) => {
        return <Popper
            {...props}
            placement='bottom-start'
            disablePortal={true}
            modifiers={[
                {
                    name: 'flip',
                    enabled: false,
                    options: {
                        altBoundary: true,
                        rootBoundary: 'document',
                        padding: 8,
                    },
                },
            ]}
        />;
    }, []);

    const getOpObjValue = (val) => {
        let res = [];
        if (val) {
            val.forEach(element => {
                let value = props.options.find(op => op.value === element);
                if (value) {
                    res.push(value);
                }
            });
        }
        return res;
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { invalid, error } }) => {
                return (
                    <>
                        <Autocomplete
                            multiple
                            disableCloseOnSelect
                            ref={ref}
                            id={props.name}
                            disabled={disabled}
                            fullWidth={fullWidth}
                            size={"small"}
                            options={props.options ?? []}
                            value={getOpObjValue(value)}
                            noOptionsText={props.notOptionsText ?? t("noInformationFound")}
                            disableClearable={isClearable}
                            limitTags={nlimitTags}
                            PopperComponent={isPopperCustom ? PopperCustom : undefined}
                            renderOption={(props_, option, { selected }) => {
                                return (
                                    <li {...props_} key={option.value}>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            style={{ marginRight: 8 }}
                                            checked={option.value === "All999" ? (value ?? []).length === (props.options ?? []).length : selected}
                                            onChange={(e, v) => {

                                                if (option.value === "All999" && (!v)) {
                                                    onChange()
                                                    setValue(name, []);
                                                    if (props.onChange) {
                                                        props.onChange([], e);
                                                    }

                                                } else {
                                                    let val = [];
                                                    if (value) {
                                                        if (e.target.checked) {
                                                            if (option.value === "All999") {
                                                                val = props.options.map(m => m.value);
                                                            } else {
                                                                let lst: any = (value ?? []).filter(f => f !== option.value);
                                                                lst.push(option.value);
                                                                val = lst;
                                                            }
                                                        } else {
                                                            val = (value ?? []).filter(f => f !== option.value)
                                                        }
                                                    } else {
                                                        if(e.target.checked) {
                                                            val.push(option.value)
                                                        }
                                                    }
                                                    onChange(val);
                                                    setValue(name, val);
                                                    if (props.onChange) {
                                                        props.onChange(val, e);
                                                    }
                                                }
                                            }}
                                        />
                                        {option.label}
                                    </li>
                                );
                            }}
                            getOptionLabel={(itemOption: any) => {
                                return `${itemOption?.label}`
                            }}
                            filterOptions={(options, params) => {
                                const filtered = params.inputValue ? options.filter((f: any) => f.label.toLowerCase().includes(params.inputValue.toLowerCase())) : options;

                                if (props.nLimits != null) {
                                    let filtered_ = filtered.slice(0, props.nLimits);
                                    return isSelectAll ? [{ label: "เลือกทั้งหมด", value: "All999" }, ...filtered_] : filtered_;
                                } else {
                                    return isSelectAll ? [{ label: "เลือกทั้งหมด", value: "All999" }, ...filtered] : filtered;
                                }
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    name={name}
                                    error={error?.message != null}
                                    required={props.required}
                                    disabled={disabled}
                                    label={props.label}
                                    placeholder={getOpObjValue(value).length === 0 ? props.placeholder : null}
                                    size={"small"}
                                    fullWidth={fullWidth}
                                    style={props.style}
                                    InputProps={{
                                        ...params.InputProps,
                                    }}
                                    sx={{
                                        "label.MuiInputLabel-shrink": {
                                            top: "0px",
                                        },
                                        ".MuiInputLabel-outlined": {
                                            top: "0px",
                                        },
                                        ".MuiInputLabel-asterisk": {
                                            color: "red"
                                        }
                                    }}
                                />
                            }
                            onChange={(event, selectedOptions, reason) => {
                                if (reason === "selectOption" || reason === "removeOption") {
                                    selectedOptions = selectedOptions.filter(f => f !== undefined && f != null);
                                    if (selectedOptions.find(option => option.value === "All999")) {
                                        const allSelected = props.options.length === (value ?? []).length;
                                        if (!allSelected) {
                                            setValue(name, props.options.filter(f => f.value !== "All999").map(m => m.value));
                                            onChange(props.options.filter(f => f.value !== "All999").map(m => m.value))
                                            if (props.onChange) {
                                                props.onChange(props.options.filter(f => f.value !== "All999").map(m => m.value), event);
                                            }
                                        } else {
                                            setValue(name, []);
                                            onChange([]);
                                            if (props.onChange) {
                                                props.onChange([], event);
                                            }
                                        }
                                    } else {
                                        let arr = (selectedOptions ?? []).filter(f => f.value !== "All999").map(m => m["value"]);
                                        setValue(name, arr ?? []);
                                        onChange(arr);
                                        if (props.onChange) {
                                            props.onChange(selectedOptions.filter(f => f.value !== "All999"), event);
                                        }
                                    }
                                } else if (reason === "clear") {
                                    setValue(name, []);
                                    onChange([]);
                                    if (props.onChange) {
                                        props.onChange([], event);
                                    }
                                }

                            }}
                            onBlur={(event) => {
                                onBlur();
                                if (props.onBlur) {
                                    props.onBlur(event);
                                }
                            }}
                            onKeyPress={(event) => {
                                if (props.onKeyPress) {
                                    props.onKeyPress(event);
                                }
                            }}
                            onKeyDown={(event) => {
                                if (props.onKeyDown) {
                                    props.onKeyDown(event);
                                }
                            }}
                            onKeyUp={(event) => {
                                if (props.onKeyUp) {
                                    props.onKeyUp(event);
                                }
                            }}
                        />
                        {isMessageError && error ? (
                            <FormHelperText sx={{ color: "red" }}>
                                {error.message}
                            </FormHelperText>
                        ) : null}
                    </>
                )
            }
            }
        />
    );
});

export const SelectMultipleNoFormItem = forwardRef((props: SelectNoFromProps, ref) => {
    const {
        fullWidth = true,
        nlimitTags = 2,
        isSelectAll = true,
        isClearable = false,
        disabled = false,
        isPopperCustom = true,
    } = props;

    const [value, setValue] = useState<string[]>(props.value);

    const [t] = useTranslation();
    const PopperCustom = useCallback((props) => {
        return <Popper
            {...props}
            placement='bottom-start'
            disablePortal={true}
            modifiers={[
                {
                    name: 'flip',
                    enabled: false,
                    options: {
                        altBoundary: true,
                        rootBoundary: 'document',
                        padding: 8,
                    },
                },
            ]}
        />;
    }, []);

    const getOpObjValue = (val) => {
        let res = [];
        if (val) {
            val.forEach(element => {
                res.push(props.options.find(op => op.value === element));
            });

        }
        return res;
    };

    return (
        <Autocomplete
            multiple
            disableCloseOnSelect
            ref={ref}
            id={props.id}
            disabled={disabled}
            fullWidth={fullWidth}
            size={"small"}
            options={props.options ?? []}
            value={getOpObjValue(value)}
            noOptionsText={props.notOptionsText ?? t("noInformationFound")}
            disableClearable={isClearable}
            limitTags={nlimitTags}
            PopperComponent={isPopperCustom ? PopperCustom : undefined}
            renderOption={(props_, option, { selected }) => {
                return (
                    <li {...props_} key={option.value}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={option.value === "All999" ? (value ?? []).length === (props.options ?? []).length : selected}
                            onChange={(e, v) => {
                                if (option.value === "All999" && (!v)) {
                                    if (props.onChange) {
                                        props.onChange([], e);
                                    }
                                    setValue([])
                                } else {
                                    let val = [];
                                    if (value) {
                                        if (e.target.checked) {
                                            let lst: any = (value ?? []).filter(f => f !== option.value);
                                            lst.push(option.value);
                                            val = lst;
                                        } else {
                                            val = (value ?? []).filter(f => f !== option.value)
                                        }
                                    } else {
                                        if (e.target.checked) {
                                            val.push(option.value)
                                        }
                                    }
                                    if (props.onChange) {
                                        props.onChange(val, e);
                                    }
                                }
                            }}
                        />
                        {option.label}
                    </li>
                );
            }}
            filterOptions={(options, params) => {
                const filtered = params.inputValue ? options.filter((f: any) => f.label.toLowerCase().includes(params.inputValue.toLowerCase())) : options;

                if (props.nLimits != null) {
                    let filtered_ = filtered.slice(0, props.nLimits);
                    return isSelectAll ? [{ label: "Select All", value: "All999" }, ...filtered_] : filtered_;
                } else {
                    return isSelectAll ? [{ label: "Select All", value: "All999" }, ...filtered] : filtered;
                }
            }}
            getOptionLabel={(itemOption: any) => {
                return `${itemOption?.label}`
            }}
            renderInput={(params) =>
                <TextField
                    {...params}
                    name={props.id}
                    disabled={disabled}
                    label={props.label}
                    placeholder={getOpObjValue(value).length === 0 ? props.placeholder : null}
                    size={"small"}
                    fullWidth={fullWidth}
                    style={props.style}
                    InputProps={{
                        ...params.InputProps,
                    }}
                    sx={{
                        "label.MuiInputLabel-shrink": {
                            // backgroundColor: "rgb(255 255 255 / 18%)",
                            top: "0px",
                        },
                        ".MuiInputLabel-outlined": {
                            top: "0px",
                        },
                        ".MuiInputLabel-asterisk": {
                            color: "red"
                        }
                    }}
                />
            }
            onChange={(event, selectedOptions, reason) => {
                if (reason === "selectOption" || reason === "removeOption") {
                    if (selectedOptions.find(option => option.value === "All999")) {
                        const allSelected = props.options.length === (value || []).length;
                        if (!allSelected) {
                            setValue(props.options.map(m => m.value));
                            if (props.onChange) {
                                props.onChange(props.options.map(m => m.value), event);
                            }
                        } else {
                            setValue(selectedOptions.filter(f => f.value !== "All999").map(m => m.value));
                            if (props.onChange) {
                                props.onChange(selectedOptions.filter(f => f.value !== "All999").map(m => m.value), event);
                            }
                        }
                    } else {
                        let arr = (selectedOptions || []).filter(f => f.value !== "All999").map(m => m["value"]);
                        setValue(arr || []);
                        if (props.onChange) {
                            props.onChange(selectedOptions.filter(f => f.value !== "All999"), event);
                        }
                    }
                } else if (reason === "clear") {
                    setValue([]);
                    if (props.onChange) {
                        props.onChange([], event);
                    }
                }

            }}
            onBlur={(event) => {
                if (props.onBlur) {
                    props.onBlur(event);
                }
            }}
            onKeyPress={(event) => {
                if (props.onKeyPress) {
                    props.onKeyPress(event);
                }
            }}
            onKeyDown={(event) => {
                if (props.onKeyDown) {
                    props.onKeyDown(event);
                }
            }}
            onKeyUp={(event) => {
                if (props.onKeyUp) {
                    props.onKeyUp(event);
                }
            }}
        />
    );
});

export const SelectMultipleAddOptionsFormItem = forwardRef((props: SelectFromProps, ref) => {
    const {
        name,
        fullWidth = true,
        nlimitTags = 2,
        isSelectAll = true,
        isClearable = false,
        disabled = false,
        isMessageError = true,
        isPopperCustom = true,
    } = props;
    const {
        control,
        getValues,
        setValue
    } = useFormContext();

    const [t] = useTranslation();
    const fixedOptions = [];
    const PopperCustom = useCallback((props) => {
        return <Popper
            {...props}
            placement='bottom-start'
            disablePortal={true}
            modifiers={[
                {
                    name: 'flip',
                    enabled: false,
                    options: {
                        altBoundary: true,
                        rootBoundary: 'document',
                        padding: 8,
                    },
                },
            ]}
        />;
    }, []);

    const getOpObjValue = (val) => {
        let res = [];
        if (val) {
            val.forEach(element => {
                res.push(props.options.find(op => op.value === element));
            });

        }
        return res;
    };

    const handleToggleSelectAll = (selectedOptions) => {
        const allSelected = props.options.length === (getValues(name) || []).length;
        let chkFix = (getValues(name) || []).filter(f => f === fixedOptions[0]);
        let chkData = chkFix.length > 0 ? [] : fixedOptions[0] ?? []
        if (!allSelected) {

            setValue(name, [...chkData, ...props.options.map(m => m.value)], { shouldValidate: true });
            if (props.onChange) {
                props.onChange(props.options, null);
            }
        } else {
            setValue(name, fixedOptions);
            if (props.onChange) {
                props.onChange([], null);
            }
        }
    };

    const handleChange = (event, selectedOptions, reason) => {

        let chkFix = (getValues(name) || []).filter(f => f == fixedOptions[0]);
        let chkData = chkFix.length > 0 ? [] : fixedOptions[0] ?? []
        if (reason === "selectOption" || reason === "removeOption") {
            if (selectedOptions.find(option => option?.value === "999")) {
                handleToggleSelectAll(selectedOptions);
            } else if (selectedOptions.find(option => option.value === "9999")) {
                props.options.push({ value: selectedOptions.find(option => option?.value === "9999")["newVaue"], label: selectedOptions.find(option => option?.value === "9999")["newVaue"], Isnew: true })
                let v = selectedOptions.filter(f => f?.value !== "9999").map(m => m["value"]);
                let o = selectedOptions.filter(f => f?.value === "9999").map(m => m["newVaue"]);
                setValue(name, [...chkData, ...v, ...o], { shouldValidate: true })
            } else {
                setValue(name, [...chkData, ...selectedOptions.map(m => m.value)], { shouldValidate: true })
                if (props.onChange) {
                    props.onChange(selectedOptions, event);
                }
            }
        } else if (reason === "clear") {
            setValue(name, fixedOptions, { shouldValidate: true });
            if (props.onChange) {
                props.onChange([], event);
            }
        }
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { invalid, error } }) => {
                return (
                    <>
                        <Autocomplete
                            multiple
                            disableCloseOnSelect
                            ref={ref}
                            id={name}
                            disabled={disabled}
                            fullWidth={fullWidth}
                            size={"small"}
                            options={props.options || []}
                            value={getOpObjValue(value)}
                            noOptionsText={props.notOptionsText || t("noInformationFound")}
                            disableClearable={isClearable}
                            limitTags={nlimitTags}
                            PopperComponent={isPopperCustom ? PopperCustom : undefined}
                            renderOption={(props_, option, { selected }) => {
                                return (
                                    <li {...props_} key={option.value}>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            style={{ marginRight: 8 }}
                                            checked={((getValues(name) || []).length > 0 && option.value === "999" && props.options.length === (getValues(name) || []).length) || selected ? true : selected}
                                        />
                                        {option.label}
                                    </li>
                                );
                            }}
                            getOptionLabel={(itemOption: any) => {
                                return `${itemOption?.label}`
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                if (params.inputValue !== '') {
                                    if (props.options.filter(f => f.value === params.inputValue).length === 0) {
                                        filtered.push({
                                            value: "9999",
                                            label: `Add "${params.inputValue}"`,
                                            newVaue: params.inputValue
                                        });
                                    }
                                }

                                if (props.nLimits != null) {
                                    let filtered_ = filtered.slice(0, props.nLimits);
                                    return isSelectAll ? [{ label: "Select All", value: "999" }, ...filtered_] : filtered_;
                                } else {
                                    return isSelectAll ? [{ label: "Select All", value: "999" }, ...filtered] : filtered;
                                }
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    name={name}
                                    error={error?.message != null}
                                    required={props.required}
                                    disabled={disabled}
                                    label={props.label}
                                    placeholder={getOpObjValue(value).length === 0 ? props.placeholder : null}
                                    size={"small"}
                                    fullWidth={fullWidth}
                                    style={props.style}
                                    InputProps={{
                                        ...params.InputProps,
                                    }}
                                    sx={{
                                        "label.MuiInputLabel-shrink": {
                                            top: "0px",
                                        },
                                        ".MuiInputLabel-outlined": {
                                            top: "0px",
                                        },
                                        ".MuiInputLabel-asterisk": {
                                            color: "red"
                                        }
                                    }}
                                />
                            }
                            onChange={handleChange}
                            onBlur={(event) => {
                                onBlur();
                                if (props.onBlur) {
                                    props.onBlur(event);
                                }
                            }}
                            onKeyPress={(event) => {
                                if (props.onKeyPress) {
                                    props.onKeyPress(event);
                                }
                            }}
                            onKeyDown={(event) => {
                                if (props.onKeyDown) {
                                    props.onKeyDown(event);
                                }
                            }}
                            onKeyUp={(event) => {
                                if (props.onKeyUp) {
                                    props.onKeyUp(event);
                                }
                            }}
                        />
                        {isMessageError && error ? (
                            <FormHelperText sx={{ color: "red" }}>
                                {error.message}
                            </FormHelperText>
                        ) : null}
                    </>
                )
            }
            }
        />
    );
});

export const SelectMultipleAddOptionsNoFormItem = forwardRef((props: SelectNoFromProps, ref) => {
    const {
        fullWidth = true,
        nlimitTags = 2,
        isSelectAll = true,
        isClearable = false,
        disabled = false,
        isPopperCustom = true,
    } = props;

    const [value, setValue] = useState<string[]>(props.value);
    const [t] = useTranslation();
    const fixedOptions = [];
    const PopperCustom = useCallback((props) => {
        return <Popper
            {...props}
            placement='bottom-start'
            disablePortal={true}
            modifiers={[
                {
                    name: 'flip',
                    enabled: false,
                    options: {
                        altBoundary: true,
                        rootBoundary: 'document',
                        padding: 8,
                    },
                },
            ]}
        />;
    }, []);

    const getOpObjValue = (val) => {
        let res = [];
        if (val) {
            val.forEach(element => {
                res.push(props.options.find(op => op.value === element));
            });

        }
        return res;
    };

    const handleToggleSelectAll = (selectedOptions) => {
        const allSelected = props.options.length === (value || []).length;
        let chkFix = (value || []).filter(f => f === fixedOptions[0]);
        let chkData = chkFix.length > 0 ? [] : fixedOptions[0] ?? []
        if (!allSelected) {
            setValue([...chkData, ...props.options.map(m => m.value)]);
            if (props.onChange) {
                props.onChange(props.options, null);
            }
        } else {
            setValue(fixedOptions);
            if (props.onChange) {
                props.onChange([], null);
            }
        }
    };

    const handleChange = (event, selectedOptions, reason) => {

        let chkFix = (value || []).filter(f => f === fixedOptions[0]);
        let chkData = chkFix.length > 0 ? [] : fixedOptions[0] ?? []
        if (reason === "selectOption" || reason === "removeOption") {
            if (selectedOptions.find(option => option?.value === "ALL999")) {
                handleToggleSelectAll(selectedOptions);
            } else if (selectedOptions.find(option => option.value === "ADD9999")) {
                props.options.push({ value: selectedOptions.find(option => option?.value === "ADD9999")["newVaue"], label: selectedOptions.find(option => option?.value === "ADD9999")["newVaue"], Isnew: true })
                let v = selectedOptions.filter(f => f?.value !== "ADD9999").map(m => m["value"]);
                let o = selectedOptions.filter(f => f?.value === "ADD9999").map(m => m["newVaue"]);
                setValue([...chkData, ...v, ...o])
                if (props.onChange) {
                    props.onChange(selectedOptions, event);
                }
            } else {
                setValue([...chkData, ...selectedOptions.map(m => m.value)])
                if (props.onChange) {
                    props.onChange(selectedOptions, event);
                }
            }
        } else if (reason === "clear") {
            setValue(fixedOptions);
            if (props.onChange) {
                props.onChange([], event);
            }
        }
    };

    return (
        <Autocomplete
            multiple
            disableCloseOnSelect
            ref={ref}
            id={props.id}
            disabled={disabled}
            fullWidth={fullWidth}
            size={"small"}
            options={props.options || []}
            value={getOpObjValue(value)}
            noOptionsText={props.notOptionsText || t("noInformationFound")}
            disableClearable={isClearable}
            limitTags={nlimitTags}
            PopperComponent={isPopperCustom ? PopperCustom : undefined}
            renderOption={(props_, option, { selected }) => {
                return (
                    <li {...props_} key={option.value}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={((value || []).length > 0 && option.value === "ALL999" && props.options.length === (value || []).length) || selected ? true : selected}
                        />
                        {option.label}
                    </li>
                );
            }}
            getOptionLabel={(itemOption: any) => {
                return `${itemOption?.label}`
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                if (params.inputValue !== '') {
                    if (props.options.filter(f => f.value === params.inputValue).length === 0) {
                        filtered.push({
                            value: "ADD9999",
                            label: `Add "${params.inputValue}"`,
                            newVaue: params.inputValue
                        });
                    }
                }
                if (props.nLimits != null) {
                    let filtered_ = filtered.slice(0, props.nLimits);
                    return isSelectAll ? [{ label: "Select All", value: "ALL999" }, ...filtered_] : filtered_;
                } else {
                    return isSelectAll ? [{ label: "Select All", value: "ALL999" }, ...filtered] : filtered;
                }
            }}
            renderInput={(params) =>
                <TextField
                    {...params}
                    name={props.id}
                    disabled={disabled}
                    label={props.label}
                    placeholder={getOpObjValue(value).length === 0 ? props.placeholder : null}
                    size={"small"}
                    fullWidth={fullWidth}
                    style={props.style}
                    InputProps={{
                        ...params.InputProps,
                    }}
                    sx={{
                        "label.MuiInputLabel-shrink": {
                            top: "0px",
                        },
                        ".MuiInputLabel-outlined": {
                            top: "0px",
                        },
                        ".MuiInputLabel-asterisk": {
                            color: "red"
                        }
                    }}
                />
            }
            onChange={handleChange}
            onBlur={(event) => {
                if (props.onBlur) {
                    props.onBlur(event);
                }
            }}
            onKeyPress={(event) => {
                if (props.onKeyPress) {
                    props.onKeyPress(event);
                }
            }}
            onKeyDown={(event) => {
                if (props.onKeyDown) {
                    props.onKeyDown(event);
                }
            }}
            onKeyUp={(event) => {
                if (props.onKeyUp) {
                    props.onKeyUp(event);
                }}
            }
        />
    )
});

export const SelectMultipleGroupFormItem = (props: SelectGroupFromProps) => {
    const {
        name,
        required = false,
        disabled = false,
        isOptionTwoLanguage = false,
        subLabel,
        fullWidth = true,
        nlimitTags = 1,
        defaultSelectAll = false,
        isBorderRadius = false,
        isMessageError = true,
        isPopperCustom = true,
        options,
        label,
        onClearOptions,
        selectAllLabel = "เลือกทั้งหมด",
        IsShrink = true,
        sxCustomLabelChip,
    } = props;

    const {
        register,
        getValues,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext();
    
    const [arrParentIDExpand, setArrParentIDExpand] = useState([]);
    const [lang, setLang] = useState("");
    const handleToggleSelectAll = (selectedOptions) => {
        const allSelected = options.length === (getValues(name) || []).length;
        if (!allSelected) {
            setValue(name, [...options.map((m) => m.value)]);
            if(props.onChange){
                props.onChange(options);
            }
        } else {
            setValue(name, []);
            if(props.onChange){
                props.onChange([]);
            }
        }
    };

    const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
    };

    const handleChange = (event, selectedOptions, reason) => {
        let nValue = event.target.value + "";
        if (!nValue) {
            return;
        }

        setValue("input_" + name, "");

        if (reason === "selectOption" || reason === "removeOption") {
            //Select All
            if (selectedOptions.find((option) => option && option.value === "0")) {
                handleToggleSelectAll(selectedOptions);
            } else {
                setValue(
                    name,
                    selectedOptions.map((m) => m.value),
                    { shouldValidate: true }
                );

                //Parent Selected
                let arrAllParent = options.filter((f) => f.isParent);
                let arrAllParentID = arrAllParent.map((f) => f.value);
                let isParentSelected = arrAllParentID.includes(nValue);
                if (reason === "selectOption") {
                    //Parent
                    if (isParentSelected) {
                        let arrOptionSelectedParent = options.filter(
                            (f) => !f.isParent && f.sParentID === nValue
                        );
                        if (arrOptionSelectedParent.length === 0) {
                            arrOptionSelectedParent = options.filter(f => f.value === nValue)
                        }
                        let arrSelectedAllParent = [
                            ...watch(name),
                            ...arrOptionSelectedParent.map((m) => m.value),
                        ];
                        setValue(name, arrSelectedAllParent.filter(onlyUnique), {
                            shouldValidate: true,
                        });
                        if (arrOptionSelectedParent.length > 0) {
                            setExpand(nValue);
                        }
                    } else {
                        //Children
                        let objParent = options.find((f) => f.value === nValue);
                        let sParentID = objParent ? objParent.sParentID : "0";
                        setExpand(sParentID);
                        let nCountChildrenOfParent = options.filter(
                            (f) => f.sParentID === sParentID
                        ).length;
                        //Children Selected in Parent
                        let nCountChildrenSelectedOfParent = selectedOptions.filter(
                            (f) => f.sParentID === sParentID
                        ).length;
                        let arrSelectedAllParent = [...selectedOptions.map((m) => m.value)];
                        if (nCountChildrenSelectedOfParent >= nCountChildrenOfParent) {
                            arrSelectedAllParent.push(sParentID);
                        }
                        setValue(name, arrSelectedAllParent.filter(onlyUnique), {
                            shouldValidate: true,
                        });
                    }
                } else if (reason === "removeOption") {
                    //Parent
                    if (isParentSelected) {
                        let arrOptionIsParentID = options
                            .filter((f) => !f.isParent && f.sParentID === nValue)
                            .map((m) => m.value);

                        if (!options.some(s => !s.isParent && s.sParentID === nValue)) {
                            arrOptionIsParentID = [nValue]
                        }

                        let arrSelectedID = watch(name).filter(
                            (f) => !arrOptionIsParentID.includes(f)
                        );
                        setValue(name, arrSelectedID, { shouldValidate: true });
                        removeExpand(nValue);
                    } else {
                        //Children
                        let objParent = options.find((f) => f.value === nValue);
                        let sParentID = objParent ? objParent.sParentID : "0";
                        setValue(
                            name,
                            selectedOptions.map((m) => m.value).filter((f) => f !== sParentID),
                            { shouldValidate: true }
                        );
                    }
                }
                if(props.onChange){
                    props.onChange(selectedOptions);
                }
            }
        } else if (reason === "clear") {
            if(onClearOptions){
                onClearOptions();
            }
            setValue(name, [], { shouldValidate: true });
            if(props.onChange){
                props.onChange([]);
            }
            setArrParentIDExpand([]);
        }
    };

    const setExpand = (sParentID) => {
        setArrParentIDExpand([...arrParentIDExpand, sParentID]);
    };
    const removeExpand = (sParentID) => {
        let arrCloneParentID = arrParentIDExpand;
        arrCloneParentID = arrCloneParentID.filter((f) => f !== sParentID);
        setArrParentIDExpand([...arrCloneParentID]);
    };

    const valueFrom = () => {
        let sValue = watch(name);
        if (sValue && options) {
            return sValue.map((value) =>
                options.find((option) => option.value === value)
            );
        }
        return [];
    };

    useEffect(() => {
        setLang(secureLocalStorage.getItem("language") ? secureLocalStorage.getItem("language").toString() : "th");
        if (defaultSelectAll && options.length > 0) {
            handleToggleSelectAll(options);
        }

        //Select Parent if children select all
        if (options.length > 0) {
            let arrAllParent = options.filter((f) => f.isParent);
            let arrChildrenSeleted = getValues(name) || [];

            //Loop Parent
            arrAllParent.forEach((iP) => {
                let arrChildrenOfParent = options.filter(
                    (f) => f.sParentID === iP.value
                );

                let isSelectAllChildren = true;

                if (arrChildrenOfParent.length === 0) {
                    isSelectAllChildren = false;
                }
                //Loop Children
                arrChildrenOfParent.forEach((iC) => {
                    if (!arrChildrenSeleted.includes(iC.value)) {
                        isSelectAllChildren = false;
                    }

                });
                if (isSelectAllChildren) {
                    arrChildrenSeleted.push(iP.value);
                }
            });

            setValue(name, arrChildrenSeleted.filter(onlyUnique));
        }
    }, [options]);

    const handleExpand = (sParentID) => {
        let arrClone = arrParentIDExpand;
        let isExist = arrClone.findIndex((f) => f === sParentID) !== -1;
        if (!isExist) {
            arrClone.push(sParentID);
        } else {
            arrClone = arrClone.filter((f) => f !== sParentID);
        }
        setArrParentIDExpand([...arrClone]);
    };

    const handleAutoCompleteChange = (e) => {
        let sText = e.target.value;
        setValue("input_" + name, sText);
    };

    const langCode = secureLocalStorage.getItem("language") || "th";

    const PopperCustom = useCallback((props) => {
        return <Popper
            {...props}
            placement='bottom-start'
            disablePortal={true}
            modifiers={[
                {
                    name: 'flip',
                    enabled: false,
                    options: {
                        altBoundary: true,
                        rootBoundary: 'document',
                        padding: 8,
                    },
                },
            ]}
        />;
    }, []);

    return (
        <>
            <Autocomplete
                size={"small"}
                id={name}
                {...register(name)}
                multiple
                disableCloseOnSelect
                selectOnFocus
                PopperComponent={isPopperCustom ? PopperCustom : undefined}
                onChange={handleChange}
                limitTags={nlimitTags ?? 1}
                disableClearable={disabled ?? false}
                getOptionLabel={(option: any) =>
                    isOptionTwoLanguage ? option[`label_${langCode}`] : option.label
                }
                options={options}
                value={valueFrom()}
                isOptionEqualToValue={(option, value) => {
                    if (value) {
                        return option.value === value.value;
                    }
                }}
                getOptionDisabled={() => disabled ?? false}
                disabled={disabled ?? undefined}
                noOptionsText={"ไม่พบข้อมูล"}
                renderTags={(tagValue, getTagProps) => {
                    let arrParent = tagValue.filter(f => f.isParent)
                    let arrParentNotChildren = []
                    arrParent.forEach(f => {
                        if (!options.some(s => s.sParentID === f.value && !f.isParent)) {
                            arrParentNotChildren.push(f)
                        }
                    })
                    tagValue = [...tagValue.filter((f) => f && !f.isParent && f !== undefined), ...arrParentNotChildren]
                    if (tagValue !== undefined) {
                        return (
                            <React.Fragment>
                                {tagValue.slice(0, nlimitTags).map((option: any, index) => (
                                    <Chip
                                        key={option.value}
                                        sx={{ ".MuiChip-label": { ...sxCustomLabelChip } }}
                                        size={"small"}
                                        {...getTagProps({ index })}
                                        label={
                                            isOptionTwoLanguage
                                                ? option[`label_${langCode}`]
                                                : option.label
                                        }
                                        disabled={disabled ?? false}
                                        onDelete={null}
                                    />
                                ))}
                                {tagValue.length > nlimitTags ? (
                                    <Chip
                                        size={"small"}
                                        label={"+" + (tagValue.length - nlimitTags)}
                                        disabled={disabled ?? false}
                                        onDelete={null}
                                    />
                                ) : (
                                    <React.Fragment></React.Fragment>
                                )}
                            </React.Fragment>
                        );
                    }
                }}
                renderOption={(props, option, { selected }) =>
                    option.isParent ??
                        (isOptionTwoLanguage ? option[`label_${langCode}`] : option.label) ===
                        selectAllLabel ? (
                        <ListItemButton key={option.value} style={{ padding: 0 }}>
                            <ListItem {...props} key={option.value} value={option.value}>
                                <>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        value={option.value}
                                        checked={
                                            ((getValues(name) ?? []).length > 0 &&
                                                option.value === "0" &&
                                                options.length === (getValues(name) ?? []).length) ??
                                                selected
                                                ? true
                                                : selected
                                        }
                                    />
                                    {isOptionTwoLanguage
                                        ? option[`label_${langCode}`]
                                        : option.label}
                                </>
                            </ListItem>
                            {options.some(s => s.sParentID === option.value && !s.isParent) ?
                                (arrParentIDExpand.findIndex((f) => f === option.value) !== -1 ||
                                    getValues("input_" + name).length > 0) ? (
                                    <Box
                                        sx={{ pl: 1, pr: 1, pt: 1.5, pb: 1.5 }}
                                        onClick={() => handleExpand(option.value)}
                                    >
                                        <ExpandLess />
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{ pl: 1, pr: 1, pt: 1.5, pb: 1.5 }}
                                        onClick={() => handleExpand(option.value)}
                                    >
                                        <ExpandMore />
                                    </Box>
                                )
                                : <></>}

                        </ListItemButton>
                    ) : (
                        <Collapse
                            key={option.value}
                            in={
                                arrParentIDExpand.findIndex((f) => f === option.sParentID) !==
                                -1 || getValues("input_" + name).length > 0
                            }
                            timeout="auto"
                            unmountOnExit
                        >
                            <List component="div" disablePadding>
                                <ListItem {...props} key={option.value} value={option.value}>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        value={option.value}
                                        checked={
                                            ((getValues(name) ?? []).length > 0 &&
                                                option.value === "0" &&
                                                options.length === (getValues(name) ?? []).length) ??
                                                selected
                                                ? true
                                                : false
                                        }
                                    />
                                    {isOptionTwoLanguage
                                        ? option[`label_${langCode}`]
                                        : option.label}
                                </ListItem>
                            </List>
                        </Collapse>
                    )
                }
                renderInput={(params) => {
                    return (
                        <TextField
                            size={"small"}
                            name={"input_" + name}
                            {...register("input_" + name)}
                            // inputRef={register("input_" + name).ref}
                            {...params}
                            fullWidth={fullWidth}
                            style={{ width: "100%" }}
                            error={Boolean(errors[name])}
                            InputLabelProps={{
                                disabled: disabled || false,
                                shrink: IsShrink ? true : undefined,
                            }}
                            onChange={handleAutoCompleteChange}
                            placeholder={label ? (watch(name) && watch(name).length === 0 ? lang === "th" ? label + " " + selectAllLabel : selectAllLabel + " " + label : "") : undefined}
                            sx={{
                                " > label": {
                                    " > span": {
                                        fontSize: "12px",
                                        " ::before": {
                                            content: `"${required ? " *" : ""}"`,
                                            color: "red",
                                        },
                                    },
                                },
                                "label.MuiInputLabel-shrink": {
                                    backgroundColor: "rgba(255,255,255,0.95)",
                                },
                                ".MuiOutlinedInput-notchedOutline > legend": {
                                    fontSize: "0.01em",
                                },
                                ".MuiInputBase-sizeSmall": {
                                    borderRadius: isBorderRadius ? "50px" : "auto",
                                },
                            }}
                            label={label ? (
                                <Fragment>
                                    {label}
                                    {subLabel ?
                                        <Typography
                                            fontWeight={600}
                                            component="span"
                                        >{`${subLabel}`}</Typography>
                                        : null}
                                </Fragment>
                            ) : null
                            }
                        />
                    );
                }}
            />
            {isMessageError && errors && errors[name] ? (
                <FormHelperText sx={{ color: "red" }}>
                    {errors[name].message + ""}
                </FormHelperText>
            ) : null}
        </>
    );
};