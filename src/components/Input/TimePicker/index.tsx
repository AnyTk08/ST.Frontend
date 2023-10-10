
import { Calendar } from 'primereact/calendar';
import { forwardRef, useState } from 'react';

// CSS
import "./TimePicker.css";
import 'primereact/resources/primereact.css';                       // core css
import 'primeicons/primeicons.css';                                 // icons
import 'primeflex/primeflex.css';
import { Controller, useFormContext } from 'react-hook-form';
import {  TimePickerFormprop, TimePickerNoFormprop } from './TimePickerProps';
import { FormHelperText } from '@mui/material';

export const TimePickerForm = forwardRef((props: TimePickerFormprop, ref) => {
    const {
        id,
        name,
        required = false,
        isMessageError = true,
    } = props;

    const {
        control,
    } = useFormContext();

    return (
        <>
            <Controller
                name={name}
                control={control}
                render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { invalid, error } }) => {
                    return (
                        <>
                            <div className="card flex flex-wrap gap-3 p-fluid">
                                <div className="flex-auto">
                                    <span className="p-float-label">
                                        <Calendar
                                            inputRef={ref}
                                            id={id} //"calendar-timeonly"
                                            value={value || null}
                                            className={invalid ? "p-invalid" : ""}
                                            onChange={(e) => {
                                                onChange(e.value);
                                                if(props.onChange){
                                                    props.onChange(e.value);
                                                }
                                            }}
                                            timeOnly
                                            required={required}
                                            // fullWidth={fullWidth}
                                            disabled={props.disabled || false}
                                            icon={props.icon}
                                            iconPos={props.iconPosition}
                                            showIcon={props.showIcon}
                                            placeholder={props.hourFormat == "12" ? "12:00 AM" : "00:00"}
                                            hourFormat={props.hourFormat}
                                            mask={props.hourFormat == "12" ? "99:99 aa" : "99:99"}
                                        />
                                        <label htmlFor="time_picker_label" className={invalid ? "time-picker-invalid" : ""}>{props.label + " "}
                                            {required &&
                                                <span className="time-picker-required">
                                                    *
                                                </span>
                                            }
                                        </label>
                                    </span>
                                    {isMessageError && error ? (
                                        <FormHelperText sx={{ color: "red" }}>
                                            {error.message}
                                        </FormHelperText>
                                    ) : null}
                                </div>
                            </div>
                        </>
                    )
                }
                }
            />
        </>
    );
})
export default TimePickerForm;

export const TimePickerNoForm = forwardRef((props: TimePickerNoFormprop, ref) => {
    const {
        id,
        name,
        IsShrink = true,
    } = props;

    const [value, setValue] = useState<any>(props.value);

    return (
        <>
            <div className="card flex flex-wrap gap-3 p-fluid">
                <div className="flex-auto">
                    <span className="p-float-label">
                        <Calendar
                            {...props}
                            key={props.id}
                            // inputRef={ref}
                            id={id} //"calendar-timeonly".
                            name={name}
                            value={value || null}
                            onChange={(e) => {
                                setValue(e.value);
                                if(props.onChange){
                                    props.onChange(e.value);
                                }
                            }}
                            timeOnly
                            required={false}
                            disabled={props.disabled || false}
                            icon={props.icon}
                            iconPos={props.iconPosition}
                            showIcon={props.showIcon}
                            placeholder={props.hourFormat === "12" ? "12:00 AM" : "00:00"}
                            hourFormat={props.hourFormat}
                            mask={props.hourFormat === "12" ? "99:99 aa" : "99:99"}
                        />
                        <label htmlFor="time_picker_label">{props.label}</label>
                    </span>
                </div>
            </div>          
        </>
    );

});