import React,{  forwardRef, Fragment } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { RadioFromProps, RadioNoFromProps, RadioSingleNoFromProps, } from "./RadioProps";
import { FormLabel, RadioGroup, Radio, FormControlLabel, FormHelperText} from "@mui/material";

export const RadioForm = forwardRef((props: RadioFromProps, ref) => {
    const {
        name,
        options,
        label,
        required,
        disabled,
        isNoLabel,
    } = props;
    
    const {
        control,
        register,
    } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { invalid, error }, }) => (
                <>
                    <FormLabel
                        component="legend"
                        style={{display: isNoLabel ? "none" : 'block'}}
                        sx={{
                            color: error && error[name] ? "red !important" : "",
                            ".MuiFormLabel-root": {
                            asterisk: {
                                color: '#db3131',
                                '&$error': {
                                color: '#db3131'
                                },
                            }
                            },
                        }}
                    >{label} <span style={{ color: '#FF0000', fontSize: '15px', marginLeft: '0px' }}>{required === true ? " *" : ""}</span>
                    </FormLabel>
                    <RadioGroup
                        id={name}
                        {...props}
                        key={name}
                        {...register(name)}
                        name={name}
                        value={String(value || '')}
                        onChange={(e) => {
                            onChange(e.target.value);
                            if(props.onChange){
                                props.onChange(e.target.value);
                            }
                        }}
                        onBlur={(event) => {
                            if(props.onBlur){
                                props.onBlur(event);
                            }
                        }}
                        row={props.row ? props.row : false}
                    >
                        {options.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={String(option.value)}
                                style={{ color: option.color ? option.color : '#000000', paddingRight: '2%' }}
                                control={<Radio size="small" />}
                                label={option.label}
                                checked={String(value) !== "" ? (String(value) === String(option.value) ? true : false) : false}
                                disabled={disabled ? true : (option.disabled == true ? true : false)}
                                labelPlacement={"end"}
                            />
                        ))}
                    </RadioGroup>
                    {error ? (
                        <FormHelperText sx={{ color: "red" }}>
                            {error.message}
                        </FormHelperText>
                    ) : null}
                </>
            )
            }
        />
    );
});

export default RadioForm;

export const RadioNoForm = forwardRef((props: RadioNoFromProps, ref) => {
    const {
        name,
        options,
        value,
        disabled,
        isNoLabel,
    } = props;

    return (
        <Fragment>
            <FormLabel 
                style={{display: isNoLabel ? "none" : 'block'}}
                component="legend"
            >
                {props.label}
            </FormLabel>
            <RadioGroup
                {...props}
                key={props.name}
                // inputRef={ref}
                name={name}
                id={name}
                value={String(value || false)}
                onChange={(e) => {
                    if(props.onChange){
                        props.onChange(e.target.value);
                    }
                }}
                onBlur={(event) => {
                    if(props.onBlur){
                        props.onBlur(event);
                    }
                }}
                row={props.row ? props.row : false}
            >
                {options.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        value={String(option.value)}
                        style={{ color: option.color ? option.color : '#000000', paddingRight: '2%' }}
                        control={<Radio size="small" />}
                        label={option.label}
                        checked={String(props.value) !== "" ? (String(props.value) === String(option.value) ? true : false) : false}
                        disabled={disabled ? true : option.disabled}
                        labelPlacement={"end"}
                    />
                ))}
            </RadioGroup>
        </Fragment>
    );
});

export const RadioSingleNoForm = (props: RadioSingleNoFromProps) => {
    const {
        disabled,
        isNoLabel,
    } = props;

    return (
        <Fragment>
            <FormLabel
                style={{ display: isNoLabel ? "none" : 'block' }}
                component="legend">
                {props.label}
            </FormLabel>
            <FormControlLabel
                key={props.id}
                value={String(props.value)}
                style={{ color: '#000000', paddingRight: '2%', ...props.styleRadio }}
                control={<Radio size="small" />}
                label={props.label}
                checked={String(props.defaultValue) !== "" ? (String(props.defaultValue) === String(props.value) ? true : false) : false}
                disabled={disabled ? true : props.disabled}
                onChange={(e) => {
                    if(props.onChange){
                        props.onChange(props.value)
                    }
                }}
                labelPlacement={"end"}
            />
        </Fragment>
    );
};