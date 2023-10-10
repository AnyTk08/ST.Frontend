import React  , { forwardRef, Fragment }from "react";
import { useFormContext, Controller } from "react-hook-form";
import { SwitchFromProps, SwitchNoFromProps, } from "./SwitchProps";
import Switch from "react-switch";
import { Grid, Typography, FormHelperText, FormLabel } from '@mui/material';

export const SwitchForm = forwardRef((props: SwitchFromProps, ref) => {
    const {
        label,
        name,
        required,
        LeftText,
        RightText,
        disabled,
        width = 80,
        isNoLabel,
        IsClassName = true,
        labelRight = ""
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
                            display: (label ? "" : "none"),
                            fontSize:"0.9rem",
                            fontWeight:"bold"
                        }}
                    >{label} <span style={{ color: '#FF0000', fontSize: '15px' }}>{required === true ? " * " : " "} </span>{labelRight}
                    </FormLabel>
                    <Typography component="div">
                        <Grid item
                            component="label"
                            container
                            alignItems="center"
                            alignContent="space-between"
                            xs={12}
                            spacing={3}
                        >
                            <Grid item>
                                <label htmlFor="small-radius-switch" style={{color:"#ffffff"}}>
                                    <Switch
                                        id={name}
                                        {...props}
                                        {...register(name)}
                                        key={name}
                                        name={name}
                                        checked={value || false}
                                        value={value || true}
                                        onChange={(e) => {
                                            onChange(e);
                                            if(props.onChange){
                                                props.onChange(e);
                                            }
                                        }}
                                        handleDiameter={26}
                                        offColor={props.offColor ? props.offColor  : "#ee3a0d"}
                                        onColor={props.onColor ? props.onColor  :"#8bc34a"}
                                        // offColor="#ee3a0d"
                                        // onColor="#0ff"
                                        // offHandleColor="#0ff"
                                        // onHandleColor="#08f"
                                        height={28}
                                        width={width}
                                        // borderRadius={6}
                                        // activeBoxShadow="0px 0px 1px 2px #fffc35"
                                        disabled={disabled}
                                        uncheckedIcon={
                                            <div style={{ fontSize: '12px', paddingTop: "4px", textAlign: "center", marginLeft:"-18px" }}> {/* fontWeight: "bold",  */}
                                                {RightText || "Inactive"}
                                            </div>
                                        }
                                        checkedIcon={
                                            <div style={{ fontSize: '12px', paddingTop: "4px", textAlign: "center", marginLeft:"10px" }}>  {/* fontWeight: "bold",  */}
                                                {LeftText || "Active"}
                                            </div>
                                        }
                                        // className="react-switch"
                                        className={IsClassName ? `react-switch react-switch-${value ? "active" : "inactive"}` : "react-switch"}
                                    />
                                </label>
                            </Grid>
                        </Grid>
                    </Typography>
                    {error ? (
                        <FormHelperText sx={{ color: "red" }}>
                            {error.message}
                        </FormHelperText>
                    ) : null}
                </>
            )}
        />
    );
});

export default SwitchForm;

export const SwitchNoForm = forwardRef((props: SwitchNoFromProps, ref) => {
    const {
        label,
        isNoLabel,
        name,
        LeftText,
        RightText,
        disabled,
        width = 80,
        value,
    } = props;

    return (
        <Fragment>
            <FormLabel
                component="legend"
                style={{ marginBottom: '8px', fontSize:"14px", display: isNoLabel ? "none" : 'block' }}
            >
                {label}
            </FormLabel>
            <Typography component="div">
                <Grid item
                    component="label"
                    container
                    alignItems="center"
                    alignContent="space-between"
                    xs={12}
                    spacing={3}
                >
                    <Grid item>
                        <label htmlFor="small-radius-switch" style={{color:"#ffffff"}}>
                            <Switch
                                id={name}
                                checked={value || false}
                                // value={String(value || 'true')}
                                value={value || true}
                                onChange={(e) => {
                                    if(props.onChange){
                                        props.onChange(e);
                                    }
                                }}
                                handleDiameter={26}
                                offColor="#ee3a0d"
                                height={28}
                                width={width}
                                disabled={disabled}
                                uncheckedIcon={
                                    <div style={{ fontSize: '12px', paddingTop: "4px", textAlign: "center", marginLeft:"-18px" }}> 
                                        {RightText || "Inactive"}
                                    </div>
                                }
                                checkedIcon={
                                    <div style={{ fontSize: '12px', paddingTop: "4px", textAlign: "center", marginLeft:"10px" }}> 
                                        {LeftText || "Active"}
                                    </div>
                                }
                                className="react-switch"
                            />
                        </label>
                    </Grid>
                </Grid>
            </Typography>
        </Fragment>
    );
});