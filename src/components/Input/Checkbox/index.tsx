import { forwardRef, useState, useCallback } from "react";
import {
	CheckboxFromProps,
	CheckboxNoFromProps,
	CheckboxGroupFromProps,
	CheckboxGroupNoFromProps,
} from "./CheckboxProps";
import { Checkbox, FormHelperText, Tooltip } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { IsNullOrUndefined } from "utilities/ST_Function";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const CheckboxFormItem = forwardRef((props: CheckboxFromProps, ref) => {
	const {
		label,
		name,
		disabled,
		required,
		styleCheckBox,
	} = props;

	const {
		control,
		setValue,
		watch,
	} = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			render={({
				field: { onChange, onBlur, value, ref },
				fieldState: { invalid, error },
			}) => {
				return (
					<>
						<div style={{ display: "inline-flex" }}>
							<FormControlLabel
								control={
									<Checkbox
										ref={ref}
										id={name}
										disabled={disabled ?? false}
										checked={watch(name) ?? false}
										onChange={(e) => {
											setValue(
												name,
												e.target.checked ? true : null
											);
											onChange(
												e.target.checked ? true : null
											);
											if (props) {
												props.onChange(e.target.checked ? true : null);
											}

										}}
										onBlur={onBlur}
										required={required}
										style={styleCheckBox}
									// style={{ color: error?.message != null ? "red !important" : '', }}
									/>
								}
								style={styleCheckBox}
								label={label}
							/>
						</div>
						{error ? (
							<FormHelperText
								sx={{
									color: "red !important",
									marginLeft: "-0.1px ",
								}}
							>
								{error.message}
							</FormHelperText>
						) : null}
					</>
				);
			}}
		/>
	);
});
export default CheckboxFormItem;

export const CheckboxNoFormItem = forwardRef(
	(props: CheckboxNoFromProps, ref) => {
		const { label, disabled, required } = props;

		return (
			<div style={{ display: "inline-flex" }}>
				<FormControlLabel
					control={
						<Checkbox
							id={props.name}
							disabled={disabled ?? false}
							onChange={(e) => {
								if(props.onChange){
									props.onChange(
										e.target.checked
											? e.target.checked
											: false
									);
								}
							}}
							checked={props.value}
							required={required}
							style={props.styleCheckBox}
						/>
					}
					style={props.styleCheckBox}
					label={label}
				/>
			</div>
		);
	}
);

export const CheckboxGroupFormItem = forwardRef(
	(props: CheckboxGroupFromProps, ref) => {
		const {
			label,
			name,
			required,
			disabled,
			options = [],
			row = true,
			style,
			styleCheckbox,
			styleLabel,
			onChange,
			isTooltip = true,
		} = props;

		const {
			control,
			setValue,
			clearErrors,
			watch,
		} = useFormContext();
		const [valueAll, setValueAll] = useState(false);

		const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			if (event.target.checked) {
				let fromValue = watch(name) ?? [];
				let values_ = options.filter(
					(f) => f.value === event.target.defaultValue
				)[0];
				if (values_) {
					fromValue.push(values_.value);
					setValue(name, fromValue);
					if (onChange) {
						onChange(event, fromValue);
					}
				}
			} else {
				let values_ = (watch(name) ?? [])
					.filter((f) => f !== event.target.defaultValue)
					.map((m) => m);
				setValue(name, values_);
				if (onChange) {
					onChange(event, values_);
				}
			}
			clearErrors(name);
		};

		const handleChangeAll = (
			event: React.ChangeEvent<HTMLInputElement>
		) => {
			let values_ = options
				.filter((f) => f.disabled !== true)
				.map((m) => m.value);
			if (event.target.checked === false) {
				values_ = [];
			}
			setValueAll(event.target.checked);
			setValue(name, values_);
			clearErrors(name);
			if (onChange) {
				onChange(event, values_);
			}
		};

		const CheckboxGroup = useCallback(
			(error) => {
				let values_ = options
					.filter((f) => f.disabled !== true)
					.map((m) => m.value);
				if (values_.length === (watch(name) ?? []).length) {
					setValueAll(true);
				} else {
					setValueAll(false);
				}
				return (
					<>
						{options.map((m, i) => (
							<>
								{!IsNullOrUndefined(m.sFullName ?? null) ? (
									<Tooltip title={isTooltip ? m.sFullName : ""}>
										<FormControlLabel
											key={"ChG_" + m.index}
											control={
												<>
													<Checkbox
														size="small"
														onChange={handleChange}
														value={m.value}
														checked={
															(
																watch(name) ?? []
															).filter(
																(f) =>
																	f ===
																	m.value
															).length > 0
														}
														disabled={
															m.disabled ?? disabled
														}
														id={props.id}
														name={name}
														style={{
															color:
																error?.message !=
																	null
																	? "red !important"
																	: "",
															...styleCheckbox,
														}}
													/>
												</>
											}
											style={{
												color:
													error?.message != null
														? "#red !important"
														: "rgba(0, 0, 0, 0.6)",
												fontFamily: "Helvetica",
												fontSize: "1em",
												...styleLabel,
											}}
											label={m.label}
										/>
									</Tooltip>
								) : (
									<Tooltip placement="right" title={isTooltip ? m.label : ""}>
										<FormControlLabel
											key={"ChG_" + m.index}
											control={
												<>
													<Checkbox
														size="small"
														onChange={handleChange}
														value={m.value}
														checked={
															(
																watch(name) ?? []
															).filter(
																(f) =>
																	f ===
																	m.value
															).length > 0
														}
														disabled={
															m.disabled ?? disabled
														}
														name={name}
														style={{
															color:
																error?.message !=
																	null
																	? "red !important"
																	: "",
															...styleCheckbox,
														}}
													/>
												</>
											}
											style={{
												color:
													error?.message != null
														? "#red !important"
														: "rgba(0, 0, 0, 0.6)",
												fontFamily: "Helvetica",
												fontSize: "1em",
												...styleLabel,
											}}
											label={
												<span
													style={{
														display: "-webkit-box ",
														WebkitBoxOrient:
															"vertical",
														WebkitLineClamp: "1 ",
														overflow: "hidden ",
														wordBreak: "break-word",
														textOverflow:
															"ellipsis",
													}}
												>
													{m.label}
												</span>
											}
										/>
									</Tooltip>
								)}
							</>
						))}
					</>
				);
			},
			[options, watch(name), disabled]
		);

		return (
			<Controller
				name={name}
				control={control}
				render={({
					field: { onChange, onBlur, value, ref },
					fieldState: { invalid, error },
				}) => {
					return (
						<>
							<FormControl
								key={name}
								error={error?.message != null}
								size={"small"}
								sx={{ width: "100%" }}
								style={{ ...style }}
							>
								{label && (
									<FormLabel
										component="legend"
										sx={{
											color:
												error?.message != null
													? "red !important"
													: "",
										}}
									>
										{label}{" "}
										<span
											style={{
												color: "#FF0000",
												fontSize: "15px",
												marginLeft: "-4px",
											}}
										>
											{required === true ? " *" : ""}
										</span>
									</FormLabel>
								)}
								{props.AllowCheckAll && (
									<FormControlLabel
										style={{
											color:
												error?.message != null
													? "red !important"
													: "rgba(0, 0, 0, 0.6)",
											fontSize: "15px",
											paddingLeft: "0",
											display: "nline-flex !important",
										}}
										control={
											<Checkbox
												onChange={handleChangeAll}
												value={"All"}
												size="small"
												checked={valueAll}
												style={{
													color:
														error?.message != null
															? "red !important"
															: "",
												}}
												disabled={disabled}
											/>
										}
										label={
											props.labelCheckAll ??
											"เลือกทั้งหมด"
										}
									/>
								)}
								<FormGroup
									row={true}
									style={{
										marginLeft: "0px",
										flexDirection: row ? "row" : "column",
									}}
								>
									<CheckboxGroup error={error} />
								</FormGroup>
								{error ? (
									<FormHelperText
										sx={{
											color: "red !important",
											marginLeft: "-0.1px ",
										}}
									>
										{error.message}
									</FormHelperText>
								) : null}
							</FormControl>
						</>
					);
				}}
			/>
		);
	}
);

export const CheckboxGroupNoFormItem = forwardRef(
	(props: CheckboxGroupNoFromProps, ref) => {
		const {
			label,
			disabled,
			options = [],
			row = true,
			style,
			styleCheckbox,
			styleLabel,
			onChange,
			AllowCheckAll = true,
		} = props;
		const [valueAll, setValueAll] = useState(false);
		const [value, setValue] = useState<string[]>(props.value);
		const [t] = useTranslation();

		const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			if (event.target.checked) {
				let fromValue = value ?? [];
				let values_ = options.filter(
					(f) => f.value === event.target.defaultValue
				)[0];
				if (values_) {
					fromValue.push(values_.value);
					setValue([...fromValue]);
					if (onChange) {
						onChange(event, fromValue);
					}
				}
			} else {
				let values_ = (value ?? [])
					.filter((f) => f !== event.target.defaultValue)
					.map((m) => m);
				setValue([...values_]);
				if(onChange){
					onChange(event, values_);
				}
			}
		};

		const handleChangeAll = (
			event: React.ChangeEvent<HTMLInputElement>
		) => {
			let values_ = options
				.filter((f) => f.disabled !== true)
				.map((m) => m.value);
			if (event.target.checked === false) {
				values_ = [];
			}
			setValueAll(event.target.checked);
			setValue(values_);
			if(onChange){
				onChange(event, values_);
			}
		};

		const CheckboxGroup = useCallback(() => {
			let values_ = options
				.filter((f) => f.disabled !== true)
				.map((m) => m.value);
			if (values_.length === (value ?? []).length) {
				setValueAll(true);
			} else {
				setValueAll(false);
			}
			return (
				<>
					{options.map((m, i) => (
						<>
							<FormControlLabel
								key={"ChG_" + m.index}
								id={props.name + "_" + i}
								control={
									<>
										<Checkbox
											size="small"
											onChange={handleChange}
											value={m.value}
											checked={
												(value ?? []).filter(
													(f) => f === m.value
												).length > 0
											}
											disabled={m.disabled ?? disabled}
											style={{ ...styleCheckbox }}
										/>
									</>
								}
								style={{
									color: "rgba(0, 0, 0, 0.6)",
									fontFamily: "Helvetica",
									fontSize: "1em",
									...styleLabel,
								}}
								label={m.label}
							/>
						</>
					))}
				</>
			);
		}, [options, value, disabled]);

		return (
			<FormControl
				key={props.name}
				size={"small"}
				sx={{ width: "100%" }}
				style={{ ...style }}
			>
				{label && <FormLabel component="legend">{label}</FormLabel>}
				{AllowCheckAll && (
					<FormControlLabel
						style={{
							color: "rgba(0, 0, 0, 0.6)",
							fontSize: "15px",
							paddingLeft: "0",
							display: "nline-flex !important",
						}}
						control={
							<Checkbox
								onChange={handleChangeAll}
								value={"All"}
								size="small"
								checked={valueAll}
								disabled={disabled}
							/>
						}
						label={props.labelCheckAll ?? t("selectAll")}
					/>
				)}
				<FormGroup
					row={true}
					style={{
						marginLeft: "0px",
						flexDirection: row ? "row" : "column",
					}}
				>
					<CheckboxGroup />
				</FormGroup>
			</FormControl>
		);
	}
);
