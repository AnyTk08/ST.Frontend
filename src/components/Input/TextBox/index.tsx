import React ,{ useState, forwardRef, useRef, useEffect } from "react";
import { FormHelperText, IconButton, InputAdornment, TextField, FormControl, SxProps, InputLabel, OutlinedInput, } from "@mui/material";
import { TextBoxFormprop, TextBoxNoFormprop, TextBoxNumberNoFormprop, TextBoxNumberFormprop, TextBoxBasicNumberFormprop, TextBoxPasswordFormprop } from "./TextBoxProps";
import { Controller, useWatch, useFormContext } from "react-hook-form";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export const TextBoxForm = forwardRef((props: TextBoxFormprop, ref) => {
    const {
        name,
        fullWidth = true,
        isShowTextCont = true,
        isMessageError = true,
        rows = 1,
        required = false,
        multiline = false,
        IsShrink = true,
    } = props;

    const {
        control,
        register,
        getValues,
        setValue,
    } = useFormContext();

    const FieldName = useWatch({
        control,
        name: name,
    });

    const [Focus, SetFocus] = useState(IsShrink ? IsShrink : (props.startAdornment ?? props.endAdornment) ? true : false);
    const maxLengthText: SxProps = {
        "::after": {
            content: isShowTextCont && props.maxLength
                ? `"${getValues(name) ? getValues(name).length : 0}/${props.maxLength}"`
                : '""',
            position: "absolute",
            bottom: "5px",
            right: "10px",
            color: "#989898",
            fontSize: "10px",
        },
        // }
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { invalid, error }, }) => (
                <>
                    <TextField
                        {...props}
                        key={name}
                        inputRef={ref}
                        {...register(name)}
                        name={name}
                        rows={rows}
                        value={value || null}
                        label={props.label}
                        placeholder={props.placeholder}
                        required={required}
                        error={error?.message != null}
                        type={props.type || "text"}
                        disabled={props.disabled}
                        variant={props.variant || "outlined"}
                        fullWidth={fullWidth}
                        margin={props.margin}
                        style={props.style}
                        size={"small"}
                        autoComplete={"off"}
                        multiline={multiline}
                        sx={[{ ...maxLengthText }, {
                            ".MuiInputLabel-rrot": {
                                fontSize: "1.3rem",
                            },
                            "label.MuiInputLabel-shrink": {
                                // backgroundColor: "rgb(255 255 255 / 18%)",
                                top: "0px",
                            },
                            ".MuiInputLabel-outlined": {
                                top: "0px",
                            },
                            ".MuiInputLabel-asterisk": {
                                color: "red"
                            },
                        }]}
                        inputProps={{
                            maxLength: props.maxLength ? props.maxLength : null,
                            name,
                        }}
                        InputProps={{
                            // startAdornment: props.startAdornment,
                            // endAdornment: props.endAdornment,
                            startAdornment: props.startAdornment ? (
                                <InputAdornment position="start">
                                    {props.startAdornment}
                                </InputAdornment>
                            ) : null,
                            endAdornment: props.endAdornment ? (
                                <InputAdornment position="end">
                                    {props.endAdornment}
                                </InputAdornment>
                            ) : null,
                        }}
                        InputLabelProps={{
                            shrink: (props.startAdornment || props.endAdornment) ? true : ((FieldName || Focus) ? true : false),
                        }}
                        onChange={(e) => {
                            let sValueSet = e.target.value;
                            if (props.type === "email") {
                                sValueSet = sValueSet?.replace(/[^A-Za-z0-9@._]/gi, "");
                                setValue(name, sValueSet, { shouldValidate: true }); 
                                //setValue ใช่ตรงนี้แทนเพราะมีผลกับพวกการบังคับกรอกรูปแบบ
                            }
                            else if (props.lang === "en") {
                                sValueSet = sValueSet?.replace(/[^A-Za-z]/gi, "");
                                setValue(name, sValueSet, { shouldValidate: true }); 
                                //setValue ใช่ตรงนี้แทนเพราะมีผลกับพวกการบังคับกรอกรูปแบบ
                            }
                            else if (props.lang === "th") {
                                sValueSet = sValueSet?.replace(/[^\u0E00-\u0E7F]/gi, "");
                                setValue(name, sValueSet, { shouldValidate: true }); 
                                //setValue ใช่ตรงนี้แทนเพราะมีผลกับพวกการบังคับกรอกรูปแบบ
                            }
                            onChange(sValueSet);
                            if(props.onChange){
                                props.onChange(sValueSet);
                            }
                        }}
                        onBlur={(event) => {
                            if (!IsShrink) SetFocus(false);
                            if(props.onBlur){
                                props.onBlur(event.target.value);
                            }
                        }}
                        onKeyPress={(event) => {
                            if(props.onKeyPress){
                                props.onKeyPress(event);
                            }
                        }}
                        onKeyDown={(event) => {
                            if (event.keyCode === 32) event.stopPropagation(); 
                            //ใส่เพราะเวลาที่ถูกใช้ใน ตารางและจะเว้นวรรคไม่ได้ เพราะหลุด Focus จาก TextBox และไปแถวสุดท้าย
                            if(props.onKeyDown){
                                props.onKeyDown(event);
                            }
                        }}
                        onKeyUp={(event) => {
                            if(props.onKeyUp){
                                props.onKeyUp(event);
                            }
                        }}
                        onFocus={() => {
                            if (!IsShrink) SetFocus(true);
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
        />
    );
});
export default TextBoxForm;

export const TextBoxNoForm = forwardRef((props: TextBoxNoFormprop, ref) => {
    const {
        multiline = false,
        fullWidth = true,
        isShowTextCont = true,
        IsShrink = true,
    } = props;
    const [value, setValue] = useState<string>(props.value);

    const maxLengthText: SxProps = {
        "::after": {
            content: isShowTextCont && props.maxLength
                ? `"${value ? value.length : 0}/${props.maxLength}"`
                : '""',
            position: "absolute",
            bottom: "5px",
            right: "10px",
            color: "#989898",
            fontSize: "10px",
        },
        // }
    };

    const [Focus, SetFocus] = useState(IsShrink ? IsShrink : (props.startAdornment || props.endAdornment) ? true : false);

    return (
        <TextField
            {...props}
            key={props.id}
            inputRef={ref}
            name={props.id}
            value={value}
            label={props.label}
            placeholder={props.placeholder}
            type={props.type || "text"}
            disabled={props.disabled}
            variant={props.variant || "outlined"}
            fullWidth={fullWidth}
            margin={props.margin || "normal"}
            style={props.style}
            size={"small"}
            autoComplete={"off"}
            multiline={multiline}
            rows={props.rows}
            inputProps={{
                maxLength: props.maxLength ? props.maxLength : null,
                name: props.id,
                style: props.inputPropsStyle,
            }}
            // InputProps={props.startAdornment ? { startAdornment } : { endAdornment }}
            InputProps={{
                // startAdornment: props.startAdornment,
                // endAdornment: props.endAdornment,
                startAdornment: props.startAdornment ? (
                    <InputAdornment position="start">
                        {props.startAdornment}
                    </InputAdornment>
                ) : null,
                endAdornment: props.endAdornment ? (
                    <InputAdornment position="end">
                        {props.endAdornment}
                    </InputAdornment>
                ) : null,
            }}
            InputLabelProps={{
                shrink: (props.startAdornment || props.endAdornment) ? true : ((value || Focus) ? true : false),
            }}
            onChange={(e) => {
                let sValueSet = e.target.value;
                if (props.type == "email") {
                    sValueSet = sValueSet?.replace(/[^A-Za-z0-9@._]/gi, "");
                }
                else if (props.lang == "en") {
                    sValueSet = sValueSet?.replace(/[^A-Za-z ]/gi, "");

                }
                else if (props.lang == "th") {
                    sValueSet = sValueSet?.replace(/[^\u0E00-\u0E7F ]/gi, "");
                }
                setValue(sValueSet);
                if(props.onChange){
                    props.onChange(sValueSet);
                }
            }}
            onBlur={(event) => {
                if (!IsShrink) SetFocus(false);
                setValue(event.target.value);
                if(props.onBlur){
                    props.onBlur(event.target.value);
                }
            }}
            onKeyPress={(event) => {
                if(props.onKeyPress){
                    props.onKeyPress(event);
                }
            }}
            onKeyDown={(event) => {
                if (event.keyCode === 32) event.stopPropagation(); //ใส่เพราะเวลาที่ถูกใช้ใน ตารางและจะเว้นวรรคไม่ได้ เพราะหลุด Focus จาก TextBox และไปแถวสุดท้าย
                if(props.onKeyDown){
                    props.onKeyDown(event);
                }
            }}
            onKeyUp={(event) => {
                if(props.onKeyUp){
                    props.onKeyUp(event);
                }
            }}
            sx={[{ ...maxLengthText }, {
                // mt: props.startAdornment ? 1 : "",
                "label.MuiInputLabel-shrink": {
                    // backgroundColor: "rgb(255 255 255 / 18%)",
                    top: "0px",
                },
                ".MuiInputLabel-outlined": {
                    top: "0px",

                },
                ".MuiInputLabel-asterisk": {
                    color: "red"
                },
                ".MuiInputBase-adornedStart": {
                    background: "#fff"
                }
            }]}
            onFocus={() => {
                if (!IsShrink) SetFocus(true);
            }}
        />
    );
});

export const InputPassword = forwardRef((props: TextBoxPasswordFormprop, ref) => {
    const {
        name,
        fullWidth = true,
        placeholder,
        IsShrink = true,
    } = props;

    const {
        control,
        register,
        setValue,
    } = useFormContext();

    const FieldName = useWatch({ control, name: name, });
    const [IsTypePass, setIsTypePass] = useState(true);
    const [Focus, SetFocus] = useState(IsShrink ? IsShrink : (props.startAdornment || props.endAdornment) ? true : false);

    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { invalid, error }, }) => (
                <>
                    <TextField
                        {...props}
                        key={name}
                        inputRef={ref}
                        {...register(name)}
                        name={name}
                        value={value || null}
                        size="small"
                        label={props.label}
                        placeholder={placeholder}
                        variant={props.variant || "outlined"}
                        fullWidth={fullWidth}
                        type={!IsTypePass ? "text" : "password"}
                        sx={[{
                            "label.MuiInputLabel-shrink": {
                                // backgroundColor: "rgb(255 255 255 / 18%)",
                                top: "0px",
                            },
                            ".MuiInputLabel-outlined": {
                                top: "0px",
                            },
                            ".MuiInputLabel-asterisk": {
                                color: "red"
                            },
                            ".MuiOutlinedInput-root": {
                                paddingRight: "0px",
                                backgroundColor: 'white'
                            },
                            backgroundColor: "rgba(255,255,255,0)",
                        }]}
                        error={error?.message != null}
                        required={props.required || false}
                        style={props.style}
                        autoComplete="new-password"
                        inputProps={{ maxLength: props.maxLength ? props.maxLength : null }}
                        InputProps={{
                            name,
                            // startAdornment: props.startAdornment,
                            startAdornment: props.startAdornment ? (
                                <InputAdornment position="start">
                                    {props.startAdornment}
                                </InputAdornment>
                            ) : null,
                            endAdornment: (
                                <InputAdornment position="start">
                                    <IconButton
                                        style={{ padding: '0px' }}
                                        onClick={(() => { setIsTypePass(!IsTypePass) })}
                                    >
                                        {IsTypePass ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        onChange={(e) => {
                            let sValueSet = e.target.value;
                            setValue(name, sValueSet, { shouldValidate: true });
                            onChange(sValueSet);
                            if(props.onChange){
                                props.onChange(sValueSet);
                            }
                        }}
                        onBlur={(event) => {
                            if (!IsShrink) SetFocus(false);

                            setValue(name, event.target.value, { shouldValidate: true });
                            if(props.onBlur){
                                props.onBlur(event.target.value);
                            }
                        }}
                        onKeyPress={(event) => {
                            if(props.onKeyPress){
                                props.onKeyPress(event);
                            }
                        }}
                        onKeyDown={(event) => {
                            if(props.onKeyDown){
                                props.onKeyDown(event);
                            }
                        }}
                        onKeyUp={(event) => {
                            if(props.onKeyUp){
                                props.onKeyUp(event);
                            }
                        }}
                        InputLabelProps={{
                            shrink: (props.startAdornment || props.endAdornment) ? true : (FieldName || Focus),
                        }}
                        onFocus={() => {
                            if (!IsShrink) SetFocus(true);
                        }}
                    />
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

export const InputNumberForm = forwardRef((props: TextBoxNumberFormprop) => {
    const {
        maxInteger = 25,
        maxDigits = 8,
        IsShrink = true,
    } = props;

    const {
        control,
    } = useFormContext();

    const [Focus, SetFocus] = useState(IsShrink ? IsShrink : (props.startAdornment || props.endAdornment) ? true : false);
    let inputEl2 = null;

    const _onChange = (e, onChangeFrom) => {
        let sValue = e.target.value;
        let nVal = (sValue + "").replaceAll(/,/g, '');
        nVal = nVal.replaceAll(",", "")
        if (isNumber(nVal)) {
            if (maxInteger != undefined && maxInteger != null && maxInteger > 0) {
                let arrDig = nVal.split(".");
                let valInteger = arrDig[0].substring(0, maxInteger)
                if (arrDig.length > 1) {
                    nVal = valInteger + "." + arrDig[1];
                } else {
                    nVal = valInteger;
                }
            }
            if (maxDigits == 0) {
                let arrDig = nVal.split(".");
                nVal = arrDig[0];
            }

            let nCheck = parseFloat(nVal);
            if (nCheck >= 1 || nCheck == 0) {
                e.target.value = nVal;
            }
            else if (nCheck > 0 && nCheck < 1) {
                e.target.value = nVal;
            }
            else {
                e.target.value = '';
            }
        }
        else {
            if (nVal == "NA" || nVal == "Na" || nVal == "nA" || nVal == "N/a" || nVal == "N/A" || nVal == "na" || nVal == "n/a") {
                e.target.value = "N/A";
            } else if (nVal == "n" || nVal == "N") {
                e.target.value = "N"
            } else if (nVal == "a" || nVal == "A") {
                e.target.value = 'A'
            } else if (nVal == "N/") {
                e.target.value = "N/"
            } else {
                e.target.value = '';
            }
        }

        inputEl2 = e;
        onChangeFrom(e);
        if(props.onChange){
            props.onChange(e.target.value, inputEl2);
        }
    }

    const _onBlur = (e, onBlurFrom) => {
        let sValue = e.target.value;
        let nVal = (sValue + "").replaceAll(/,/g, '');
        nVal = nVal.replaceAll(",", "")
        if (isNumber(nVal)) {
            let nCheck = parseFloat(nVal);
            if (nCheck >= 1 || nCheck == 0) {
                e.target.value = commaSeparateNumber(nVal, props.maxDigits, maxInteger);
            }
            else if (nCheck > 0 && nCheck < 1) {
                e.target.value = commaSeparateNumber(nVal, props.maxDigits, maxInteger);
            }
            else {
                e.target.value = '';
            }
        } else {
            if (nVal == "NA" || nVal == "Na" || nVal == "nA" || nVal == "N/a" || nVal == "N/A" || nVal == "na" || nVal == "n/a") {
                e.target.value = "N/A";
            } else if (nVal == "n" || nVal == "N") {
                e.target.value = ''
            } else if (nVal == "a" || nVal == "A") {
                e.target.value = ''
            } else if (nVal == "N/") {
                e.target.value = ''
            } else {
                e.target.value = '';
            }
        }
        inputEl2 = e;
        onBlurFrom(e);
        if(props.onBlur){
            props.onBlur(e.target.value, inputEl2);
        }
    }

    return (
        <Controller
            name={props.name}
            control={control}
            render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { invalid, error }, }) => (
                <>
                    <div style={{ display: 'flex', position: 'relative' }}>
                        <TextField type={"text"}
                            ref={ref}
                            style={{
                                width: "100%",
                                ...props?.style
                            }}
                            {...props}
                            error={error?.message != null}
                            variant={props.variant || "outlined"}
                            size="small"
                            autoComplete={"off"}
                            label={props.label}
                            sx={[{
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
                            }]}
                            inputProps={{
                                style: {
                                    textAlign: props.textAlign || "right",
                                    paddingRight:
                                        (props.suffix && props.suffix !== "")
                                            ? props.suffix.length > 20 ? `${props.suffix.length * 8 + 30}px` :
                                                props.suffix.length > 15 ? `${props.suffix.length * 7 + 40}px` :
                                                    props.suffix.length > 10 ? `${props.suffix.length * 6 + 50}px` :
                                                        props.suffix.length > 5 ? `${props.suffix.length * 5 + 50}px` :
                                                            props.suffix.length > 3 ? `${props.suffix.length * 4 + 45}px` :
                                                                `${props.suffix.length * 3 + 40}px`
                                            : "",
                                },
                            }}
                            // InputProps={props.startAdornment ? { startAdornment } : { endAdornment }}
                            InputProps={{
                                // startAdornment: props.startAdornment,
                                // endAdornment: props.endAdornment,
                                startAdornment: props.startAdornment ? (
                                    <InputAdornment position="start">
                                        {props.startAdornment}
                                    </InputAdornment>
                                ) : null,
                                endAdornment: props.endAdornment ? (
                                    <InputAdornment position="end">
                                        {props.endAdornment}
                                    </InputAdornment>
                                ) : null,
                            }}
                            InputLabelProps={{
                                shrink: (props.startAdornment || props.endAdornment) ? true : ((value || Focus) ? true : false),
                            }}
                            value={
                                props.isExponential ?
                                    ConvertToExponential(value, props.ShowDigits)
                                    :
                                    commaSeparateNumber(value, maxDigits, props.ShowDigits)
                            }
                            onChange={(e) => {
                                _onChange(e, onChange)
                            }}
                            onBlur={(e) => {
                                if (!IsShrink) SetFocus(false);
                                _onBlur(e, onBlur);
                            }}
                            placeholder={props.placeholder}
                            disabled={props.disabled || false}
                            onKeyPress={(event) => {
                                if(props.onKeyPress){
                                    props.onKeyPress(event);
                                }
                            }}
                            onKeyDown={(event) => {
                                if(props.onKeyDown){
                                    props.onKeyDown(event);
                                }
                            }}
                            onKeyUp={(event) => {
                                if(props.onKeyUp){
                                    props.onKeyUp(event);
                                } 
                            }}
                            onFocus={() => {
                                if (!IsShrink) SetFocus(true);
                            }}
                        />
                        {props.suffix !== undefined ? (
                            <span
                                style={{
                                    fontSize: 16,
                                    borderColor: "rgba(255, 255, 255, 0)",
                                    backgroundColor: "rgba(255, 255, 255, 0)",
                                    paddingTop: "0.77rem",
                                    paddingLeft: "0.3rem",
                                    lineHeight: "18px",
                                    height: "100%",
                                    right: '2%',
                                    position: "absolute",
                                    color: "#929292",
                                    borderLeft: '1.2px solid #d9d9d9',
                                }}
                            >
                                {props.suffix}
                            </span>
                        ) : (
                            <div></div>
                        )}
                    </div>
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

export const InputNumberNoForm = forwardRef((props: TextBoxNumberNoFormprop) => {
    const {
        maxInteger = 25,
        maxDigits = 8,
        IsShrink = true,
    } = props;

    const inputEl = useRef(null)
    let inputEl2 = null;

    const onChange = (e) => {
        let sValue = e.target.value;
        let nVal = (sValue + "").replaceAll(/,/g, '');
        nVal = nVal.replaceAll(",", "")
        if (isNumber(nVal)) {

            if (maxInteger != undefined && maxInteger != null && maxInteger > 0) {
                let arrDig = nVal.split(".");
                let valInteger = arrDig[0].substring(0, maxInteger)
                if (arrDig.length > 1) {
                    nVal = valInteger + "." + arrDig[1];
                } else {
                    nVal = valInteger;
                }
            }
            if (maxDigits == 0) {
                let arrDig = nVal.split(".");
                nVal = arrDig[0];
            }

            let nCheck = parseFloat(nVal);
            if (nCheck >= 1 || nCheck == 0) {
                e.target.value = nVal;
            }
            else if (nCheck > 0 && nCheck < 1) {
                e.target.value = nVal;
            }
            else {
                e.target.value = '';
            }
        } else {
            if (nVal == "NA" || nVal == "Na" || nVal == "nA" || nVal == "N/a" || nVal == "N/A" || nVal == "na" || nVal == "n/a") {
                e.target.value = "N/A";
            } else if (nVal == "n" || nVal == "N") {
                e.target.value = "N"
            } else if (nVal == "a" || nVal == "A") {
                e.target.value = 'A'
            } else if (nVal == "N/") {
                e.target.value = "N/"
            } else {
                e.target.value = '';
            }
        }
        inputEl2 = e;
        if(props.onChange){
            props.onChange(e.target.value, inputEl2);
        }
    }

    const onBlur = (e) => {
        if (!IsShrink) SetFocus(false);
        let sValue = e.target.value;
        let nVal = (sValue + "").replaceAll(/,/g, '');
        nVal = nVal.replaceAll(",", "")
        if (isNumber(nVal)) {
            let nCheck = parseFloat(nVal);
            if (nCheck >= 1 || nCheck == 0) {
                e.target.value = commaSeparateNumber(nVal, props.maxDigits, maxInteger);
            }
            else if (nCheck > 0 && nCheck < 1) {
                e.target.value = commaSeparateNumber(nVal, props.maxDigits, maxInteger);
            }
            else {
                e.target.value = '';
            }
        } else {
            if (nVal == "NA" || nVal == "Na" || nVal == "nA" || nVal == "N/a" || nVal == "N/A" || nVal == "na" || nVal == "n/a") {
                e.target.value = "N/A";
            } else if (nVal == "n" || nVal == "N") {
                e.target.value = ''
            } else if (nVal == "a" || nVal == "A") {
                e.target.value = ''
            } else if (nVal == "N/") {
                e.target.value = ''
            } else {
                e.target.value = '';
            }
        }
        inputEl2 = e;
        if(props.onBlur){
            props.onBlur(e.target.value, inputEl2);
        }
    }

    const [Focus, SetFocus] = useState(IsShrink ? IsShrink : (props.startAdornment || props.endAdornment));

    return (
        <TextField
            type={"text"}
            style={{ width: "100%", ...props?.style }}
            {...props}
            value={undefined}
            ref={inputEl}
            variant={props.variant || "outlined"}
            size="small"
            autoComplete={"off"}
            label={props.label}
            inputProps={{
                style: { textAlign: props.textAlign || "right", height: props.mode == "Table" ? "15px" : "", fontSize: props.mode == "Table" ? "14px" : "" },
            }}
            // InputProps={props.startAdornment ? { startAdornment } : { endAdornment }}    
            InputProps={{
                // startAdornment: props.startAdornment,
                // endAdornment: props.endAdornment,
                startAdornment: props.startAdornment ? (
                    <InputAdornment position="start">
                        {props.startAdornment}
                    </InputAdornment>
                ) : null,
                endAdornment: props.endAdornment ? (
                    <InputAdornment position="end">
                        {props.endAdornment}
                    </InputAdornment>
                ) : null,
            }}
            InputLabelProps={{
                shrink: (props.startAdornment || props.endAdornment) ? true : (Focus ? true : false),
            }}
            defaultValue={
                props.isExponential ?
                    ConvertToExponential(props.value, props.ShowDigits)
                    :
                    commaSeparateNumber(props.value, maxDigits, props.ShowDigits)
            }
            onChange={onChange}
            onBlur={onBlur}
            placeholder={props.placeholder}
            disabled={props.disabled || false}
            onKeyPress={(event) => {
                if(props.onKeyPress){
                    props.onKeyPress(event);
                }
            }}
            onKeyDown={(event) => {
                if(props.onKeyDown){
                    props.onKeyDown(event);
                }
            }}
            onKeyUp={(event) => {
                if(props.onKeyUp){
                    props.onKeyUp(event);
                }
            }}
            onFocus={() => {
                if (!IsShrink) SetFocus(true);
            }}
        />
    );

});

export const InputBasicNumberForm = forwardRef((props: TextBoxBasicNumberFormprop, ref) => {
    const {
        label,
        placeholder,
        name,
        sx,
        required = false,
        fullWidth = true,
        type = "text",
        autoFocus,
        prefix,
        disabled = false,
        onKeyDown,
        onKeyUp,
        onKeyPress,
        onBlur,
        autoComplete = "off",
        onChange,
        startAdornment,
        endAdornment,
        maxRow,
        multiline,
        rows,
        id,
        margin,
        maxLength,
        onPaste,
        sxLabel,
        hidden,
        isNumberOnly = false,
        decimalPoint = 0,
        isMessageError = true,
        isShowMaxLength = true,
        IsShrink = true,
    } = props;

    const {
        register,
        setValue,
        getValues,
        watch,
        formState: { errors },
    } = useFormContext();

    const [sValueText, setValueText] = useState<string>("");
    useEffect(() => {
        let sValueSet = getValues(name);
        if (sValueSet ?? (typeof sValueSet != "string" && sValueSet == 0)) {
            if (typeof sValueSet == "number") {
                setValueText(checkValueSet(sValueSet.toString()));
            } else {
                setValueText(checkValueSet(sValueSet));
            }
        } else {
            setValueText(null);
        }
    }, [watch(name)]);

    const checkValueSet = (sValue) => {
        let sValueRegex = sValue;
        if (decimalPoint == 0) {
            let arrDig = sValueRegex.split(".");
            sValueRegex = arrDig[0];
            sValueRegex = sValueRegex.replace(regexNumber, "");
            sValueRegex = sValueRegex.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            sValueRegex = sValueRegex.replace(regexDecimal, "");
            let convertToFloat = parseFloat(sValueRegex);
            if (convertToFloat) {
                sValueRegex = convertToFloat
                    .toFixed(decimalPoint)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        }
        return sValueRegex;
    };

    const maxLengthText: SxProps = {
        "::after": {
            content: maxLength && isShowMaxLength
                ? (`"${sValueText ? sValueText.length : 0}/${maxLength}"`)
                : '""',
            position: "absolute",
            bottom: "2px",
            right: "10px",
            color: "#989898",
            fontSize: "10px",
        },
    };

    const regexNumber = new RegExp("[^0-9]", "g");
    const regexDecimal = new RegExp("[^0-9.]", "g");

    return (
        <FormControl
            hiddenLabel={hidden || false}
            disabled={disabled}
            size={"small"}
            fullWidth={fullWidth}
        >
            <InputLabel
                hidden={hidden || false}
                htmlFor="input"
                shrink={IsShrink ? true : undefined}
                sx={{
                    "::after": {
                        content: required && label ? '" * "' : '""',
                        color: "red",
                        fontWeight: 500,
                    },
                    color: errors && errors[name] ? "red !important" : "",
                    ...sxLabel,
                }}
            >
                {label}
            </InputLabel>
            <OutlinedInput
                hidden={hidden || false}
                inputRef={register(name).ref}
                {...register(name)}
                type={type}
                fullWidth={fullWidth}
                required={required}
                onPaste={onPaste || undefined}
                error={Boolean(errors[name])}
                name={name}
                size={"small"}
                label={label}
                placeholder={placeholder}
                sx={[{ ...maxLengthText }, sx]}
                autoFocus={autoFocus}
                notched={IsShrink ? true : undefined} // shrink: true, // Mui-focused      
                prefix={prefix || undefined}
                disabled={disabled}
                onKeyDown={(e) => {
                    if(onKeyDown){
                        onKeyDown(e);
                    }
                }}
                onKeyUp={onKeyUp || undefined}
                onKeyPress={onKeyPress || undefined}
                onBlur={(e) => {
                    let sValueRegex = e.target.value;
                    if (decimalPoint == 0) {
                        if (sValueRegex || sValueRegex == "0") {
                            sValueRegex = sValueRegex.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            setValue(name, parseInt(e.target.value.replaceAll(",", "")), {
                                shouldValidate: true,
                            });
                        } else {
                            setValue(name, null, { shouldValidate: true });
                        }
                    } else {
                        let convertToFloat = parseFloat(sValueRegex.replaceAll(",", ""));
                        if (
                            convertToFloat ||
                            (typeof convertToFloat == "number" && convertToFloat == 0)
                        ) {
                            let convertToStringCheckDigit =
                                convertToFloat.toFixed(decimalPoint);
                            sValueRegex = convertToStringCheckDigit.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ","
                            );
                            setValueText(sValueRegex);
                            setValue(name, parseFloat(convertToStringCheckDigit), {
                                shouldValidate: true,
                            });
                        } else {
                            setValue(name, null, { shouldValidate: true });
                        }
                    }
                    if(onBlur){
                        onBlur(e);
                    }
                }}
                autoComplete={autoComplete || "new-password"}
                onChange={(e) => {
                    let sValueRegex = e.target.value;
                    if (decimalPoint == 0) {
                        sValueRegex = sValueRegex.replace(regexNumber, "");
                    } else {
                        sValueRegex = sValueRegex.replace(regexDecimal, "");
                    }
                    setValueText(sValueRegex);
                    if(onChange ){
                        onChange(sValueRegex);
                    }
                }}
                // startAdornment={startAdornment || undefined}
                // endAdornment={endAdornment || undefined}
                startAdornment={startAdornment ?
                    (
                        <InputAdornment position="start">
                            {startAdornment}
                        </InputAdornment>
                    ) : null
                }
                endAdornment={endAdornment ?
                    (
                        <InputAdornment position="end">
                            {endAdornment}
                        </InputAdornment>
                    ) : null
                }
                maxRows={maxRow || undefined}
                value={sValueText || ""}
                multiline={multiline || undefined}
                rows={rows || undefined}
                id={id ?? name}
                margin={margin}
                inputProps={{
                    type: isNumberOnly ? "number" : type,
                    style: { textAlign: "end" },
                    maxLength: maxLength || 250,
                }}
            />
            {isMessageError && errors && errors[name] ? (
                <FormHelperText sx={{ color: "red !Important" }}>
                    {errors[name].message + ""}
                </FormHelperText>
            ) : null}
        </FormControl>
    );
});

//#region Fun
export const isNumber = (n) => {
    return typeof (n) != "boolean" && !isNaN(n);
}

export const convertStringToNumber = (val) => {
    if (val != undefined && val != null) {
        let values = (val + "").replaceAll(",", "")
        if (values && values != "" && values != null && isNumber(values)) {
            let valConve = parseFloat(values);
            if ((valConve + "") != "NaN") {
                return valConve;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}

export const commaSeparateNumber = (value: any, _MaxDigits?, _MaxInteger?) => {
    let MaxDigits = _MaxDigits || null;
    let MaxInteger = _MaxInteger || 25;
    if (value != undefined && value != null && (value + "") != "" && value != "N/A") {
        let val = parseFloat((value + "").replaceAll(",", ""))
        let sign = 1;
        if (val < 0) {
            sign = -1;
            val = -val;
        }
        if (value.toString().includes('.') && val.toString().includes('.') == false && _MaxDigits > 0) {
            return value;
        } else {
            let num = val.toString().includes('.') ? val.toString().split('.')[0] : val.toString();
            num = num.substring(0, MaxInteger)

            if (val.toString().includes('.')) {

                if (MaxDigits) {
                    // num = num + '.' + (val.toString().split('.')[1]).substring(0, MaxDigits); //ตัดเศษแบบไม่ปัด
                    //.toLocaleString(undefined, { maximumFractionDigits: 3, minimumFractionDigits: 2});
                    num = (+val).toLocaleString(undefined, { maximumFractionDigits: MaxDigits }).replaceAll(",", ""); //ตัดเศษแบบปัดเศษ
                } else {
                    num = num + '.' + (val.toString().split('.')[1]);
                }
            }
            //ตัดเศษแบบปัดเศษ กรณีส่ง Digits และมีค่า
            if (MaxDigits && num !== undefined && num != null && num !== "") {
                if (MaxDigits) {
                    num = (+num).toLocaleString(undefined, { maximumFractionDigits: MaxDigits }).replaceAll(",", "");
                } else {
                   num = num;
                }
            }


            if (num != undefined && num != null && num != "NaN" && num != "") {
                let indValue = (num + "").split(".");
                let valueResult = indValue[0];
                if ((num + "") != "0") {
                    while (/(\d+)(\d{3})/.test(valueResult)) {
                        valueResult = valueResult.replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
                    }
                    if (indValue.length > 1) {
                        valueResult = valueResult + "." + indValue[1]
                    }
                    return sign < 0 ? '-' + valueResult : valueResult;
                } else {
                    return sign < 0 ? '-' + "0" : "0";
                }
            } else {
                return "";
            }
        }

    } else {
        if (value == "N/A") {
            return value;
        } else {
            return "";
        }
    }
}

export const ConvertToExponential = (value, digit = 3, MinIntegerCount = 1) => {
    if (value != "N/A") {
        let value_ = (value + "").replaceAll(",", "");

        let num = Number.parseFloat(value_)
        if (num < MinIntegerCount && num != 0) {
            let val = num
            let sign = 1;
            if (val < 0) {
                sign = -1;
                val = -val;
            }
            if (sign < 0) {
                if (val < MinIntegerCount) {
                    return ConvertToExponential_(value, digit);
                } else {
                    return commaSeparateNumber(value, digit);
                }
            } else {
                return ConvertToExponential_(value, digit);

            }
        } else {
            return num == 0 ? (digit != undefined && digit != null) ? "0." + (("0").padStart(digit, "0")) : "0" : commaSeparateNumber(value, digit);
        }
    } else {
        return value;
    }
}

const ConvertToExponential_ = (value, digit = 3) => {
    let result = ""
    let value_ = (value + "").replaceAll(",", "");
    let num = Number.parseFloat(value_)
    if (!isNaN(num)) {
        result = num.toExponential(digit).replace(/e/g, 'E');
    }
    return result
}

const ConvertDigit = (sValue, nDigit) => { //โชว์จำนวณ Digit กรณีที่ไม่ได้กรอก Digit มาจะ Set Format Digit (0.00)
    let result = sValue;
    let convertToFloat = parseFloat(sValue);
    if (convertToFloat) {
        result = convertToFloat.toFixed(nDigit);
    }
    return result
}
//#endregion