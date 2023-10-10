import React , {
	useState,
	useEffect,
	forwardRef,
	useImperativeHandle,
	Fragment,
} from "react";
import {
	AutocompleteFormProp,
	AutocompleteNoFormProp,
	AsyncAutoCompleteFormProps,
	AsyncAutoCompleteNoFormProps,
} from "./AutocompleteProps";
import { useFormContext, Controller } from "react-hook-form";
import {
	Autocomplete,
	TextField,
	FormHelperText,
	IconButton,
	Popper,
	Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import axios from "axios";
import qs from "qs";
import { AuthToken } from "config/AxiosConfig";
import FormErrors from "components/FormItem/FormErrors";
import { IsNullOrUndefined } from "utilities/ST_Function";
import i18n from "config/i18nConfig";

export const AutocompleteForm = forwardRef(
	(props: AutocompleteFormProp, ref) => {
		const {
			name,
			fullWidth = true,
			fnLoadData,
			onSelect,
			TextFilterCount = 1,
			isClearable = true,
			isMessageError = true,
			isPopperCustom = true,
			IsShrink = true,
		} = props;

		const { control, getValues } = useFormContext();
		const [t] = useTranslation();
		const [txtOption, settxtOption] = useState(t("enterToSearch"));
		const [options, setOptions] = useState([] as any[]);
		const [, setloaded] = useState(false);
		const [inputValue, setInputValue] = useState("");

		const loadData = async (inputValue_) => {
			if (inputValue_.length >= TextFilterCount) {
				settxtOption(t("searching"));
				setloaded(true);
				fnLoadData(inputValue_, (result) => {
					setloaded(false);
					settxtOption("");
					if (result.length > 0) {
						setOptions(result);
					} else {
						setOptions([]);
						settxtOption(t("noInformationFound"));
					}
				});
			} else {
				setOptions([]);
				settxtOption(t("noInformationFound"));
			}
		};

		useEffect(() => {
			if (inputValue === "" || inputValue === null) {
				setOptions([]);
				settxtOption(i18n.t("enterToSearch"))
			} else {
				if (inputValue.length >= TextFilterCount) {
					let val = getValues(name);
					let v = val != null ? val.label : "";
					if (inputValue !== v) {
						loadData(inputValue);
					}
				}
			}
		}, [inputValue]);

		const PopperCustom = React.useCallback((props) => {
			return (
				<Popper
					{...props}
					placement="bottom-start"
					disablePortal={true}
					modifiers={[
						{
							name: "flip",
							enabled: false,
							options: {
								altBoundary: true,
								rootBoundary: "document",
								padding: 8,
							},
						},
					]}
				/>
			);
		}, []);

		return (
			<>
				<Controller
					name={name}
					control={control}
					render={({
						field: { onChange, onBlur, value, ref },
						fieldState: { error },
					}) => {
						return (
							<>
								<Autocomplete
									ref={ref}
									id={name}
									disabled={props.disabled ?? null}
									fullWidth={fullWidth}
									size={"small"}
									autoComplete
									options={options}
									value={value ?? null}
									clearOnBlur
									noOptionsText={txtOption}
									disableClearable={isClearable ?? null}
									inputValue={inputValue}
									onInputChange={async (
										event,
										newInputValue
									) => {
										setInputValue(newInputValue);
										if (newInputValue === "") {
											setOptions([]);
											settxtOption(i18n.t("searching"));
												if(props.onClear){
													props.onClear(event);
												}
											return undefined;
										}else {
											setOptions([]);
											settxtOption(i18n.t("noInformationFound"));
										}
									}}
									getOptionLabel={(itemOption: any) => {
										return `${itemOption.label}`;
									}}
									isOptionEqualToValue={(option, value) =>
										option.value === value.value
									}
									sx={{
										"label.MuiInputLabel-shrink": {
											top: "0px",
										},
										".MuiInputLabel-outlined": {
											top: "0px",
										},
										".MuiInputLabel-asterisk": {
											color: "red",
										},
									}}
									PopperComponent={
										isPopperCustom
											? PopperCustom
											: undefined
									}
									renderInput={(params) => (
										<TextField
											{...params}
											name={name}
											error={error?.message != null}
											required={props.required}
											disabled={props.disabled}
											label={props.label}
											placeholder={props.placeholder}
											size={"small"}
											fullWidth={fullWidth}
											style={{
												width: "100%",
												...props.style,
											}}
											InputProps={{
												...params.InputProps,
												style: props.inputPropsStyle,
												startAdornment:
													props.startAdornment,
												endAdornment: (
													<Fragment>
														{value &&
															isClearable && (
																<IconButton
																	style={{
																		padding:
																			"3px",
																		visibility:
																			"hidden",
																	}}
																	disabled={
																		props.disabled
																	}
																	id={
																		props.name +
																		"CloseIcon"
																	}
																	onClick={(
																		event
																	) => {
																		onChange();
																		if(props.onSelect){
																			props.onSelect(
																				event,
																				null)
																		}
																	}}
																>
																	<CloseIcon fontSize="small" />
																</IconButton>
															)}
														<IconButton
															style={{
																padding: "0px",
															}}
															disabled={
																props.disabled
															}
														>
															<SearchIcon />
														</IconButton>
													</Fragment>
												),
											}}
											onMouseMove={() => {
												let btCloseIcon =
													document.getElementById(
														props.name + "CloseIcon"
													);
												if (btCloseIcon) {
													btCloseIcon.style.visibility =
														"visible";
												}
											}}
											onMouseOut={() => {
												let btCloseIcon =
													document.getElementById(
														props.name + "CloseIcon"
													);
												if (btCloseIcon) {
													btCloseIcon.style.visibility =
														"hidden";
												}
											}}
											InputLabelProps={{
												disabled:
													props.disabled ?? false,
												shrink: IsShrink
													? true
													: undefined,
											}}
											sx={{
												"label.MuiInputLabel-shrink": {
													top: "0px",
												},
												".MuiInputLabel-outlined": {
													top: "0px",
												},
												".MuiInputLabel-asterisk": {
													color: "red",
												},
												".MuiInputBase-adornedEnd": {
													paddingRight:
														"12px !important",
												},
											}}
										/>
									)}
									onBlur={onBlur}
									onChange={(event, value) => {
										if(onSelect){
											onSelect(event, value);
										}
										onChange(value ?? null);
									}}
									filterOptions={(options, params) => {
										const filtered = params.inputValue
											? options.filter((f: any) =>
													f.label
														.toLowerCase()
														.includes(
															params.inputValue.toLowerCase()
														)
											  )
											: options;

										let result =
											props.nLimits != null
												? filtered.slice(
														0,
														props.nLimits
												  )
												: filtered;
										return [...result];
									}}
								/>
								{isMessageError && error ? (
									<FormHelperText sx={{ color: "red" }}>
										{error.message}
									</FormHelperText>
								) : null}
							</>
						);
					}}
				/>
			</>
		);
	}
);
export default AutocompleteForm;

export const AutocompleteNoForm = forwardRef(
	(props: AutocompleteNoFormProp, ref) => {
		const {
			fullWidth = true,
			fnLoadData,
			TextFilterCount = 1,
			isClearable = true,
			isPopperCustom = true,
			IsShrink = true,
		} = props;

		const [t] = useTranslation();
		const [value, setValue] = useState<string>(props.value);
		const [txtOption, settxtOption] = useState(t("enterToSearch"));
		const [options, setOptions] = useState([] as any[]);
		const [, setloaded] = useState(false);

		const loadData = async (inputValue_) => {
			if (inputValue_.length >= TextFilterCount) {
				settxtOption(t("searching"));
				setloaded(true);
				fnLoadData(inputValue_, (result) => {
					setloaded(false);
					settxtOption("");
					if (result.length > 0) {
						setOptions(result);
					} else {
						setOptions([]);
						settxtOption(t("noInformationFound"));
					}
				});
			} else {
				setOptions([]);
				settxtOption(t("noInformationFound"));
			}
		};

		useEffect(() => {
			setValue(props.value);
			if (props.IsClearList) {
				setOptions([]);
				settxtOption(t("noInformationFound"));
			}
		}, [props.value]);

		useImperativeHandle(ref, () => ({
			ClearOption(val: AutocompleteFormProp) {
				setOptions([]);
				settxtOption(t("noInformationFound"));
			},
		}));

		function Value() {
			if (value != undefined && value != null) {
				if (typeof value != "string") {
					return value[props.ShowLabel ?? "label"];
				} else {
					return value;
				}
			} else {
				return "";
			}
		}

		const PopperCustom = React.useCallback((props) => {
			return (
				<Popper
					{...props}
					placement="bottom-start"
					disablePortal={true}
					modifiers={[
						{
							name: "flip",
							enabled: false,
							options: {
								altBoundary: true,
								rootBoundary: "document",
								padding: 8,
							},
						},
					]}
				/>
			);
		}, []);

		return (
			<Autocomplete
				ref={ref}
				id={props.id}
				disabled={props.disabled ?? null}
				fullWidth={fullWidth}
				size={"small"}
				autoComplete
				options={options}
				value={Value()}
				noOptionsText={txtOption}
				onChange={(event, value) => {
					setValue(value);
					if(props.onSelect){
						props.onSelect(event, value)
					}
				}}
				onInputChange={async (event, newInputValue) => {
					settxtOption(t("enterToSearch"));
					if (newInputValue === "") {
						setOptions([]);
						settxtOption(t("enterToSearch"));
						setValue(null);
						return undefined;
					} else if (newInputValue.length >= TextFilterCount) {
						loadData(newInputValue);
					} else {
						setOptions([]);
						settxtOption(t("noInformationFound"));
						setValue(null);
					}
				}}
				sx={{
					"label.MuiInputLabel-shrink": {
						top: "0px",
					},
					".MuiInputLabel-outlined": {
						top: "0px",
					},
					".MuiInputLabel-asterisk": {
						color: "red",
					},
				}}
				filterOptions={(options, params) => {
					const filtered = params.inputValue
						? options.filter((f: any) =>
								f.label
									.toLowerCase()
									.includes(params.inputValue.toLowerCase())
						  )
						: options;

					let result =
						props.nLimits != null
							? filtered.slice(0, props.nLimits)
							: filtered;
					return [...result];
				}}
				PopperComponent={isPopperCustom ? PopperCustom : undefined}
				renderInput={(params) => (
					<TextField
						{...params}
						disabled={props.disabled}
						label={props.label}
						placeholder={props.placeholder}
						size={"small"}
						fullWidth={fullWidth}
						style={{ width: "100%", ...props.style }}
						InputProps={{
							...params.InputProps,
							style: props.inputPropsStyle,
							startAdornment: props.startAdornment,
							endAdornment: (
								<Fragment>
									{value && isClearable && (
										<IconButton
											style={{
												padding: "3px",
												visibility: "hidden",
											}}
											disabled={props.disabled}
											id={props.id + "CloseIcon"}
											onClick={(event) => {
												setValue(null);
													if(props.onSelect){
														props.onSelect(event, null);
													}
											}}
										>
											<CloseIcon fontSize="small" />
										</IconButton>
									)}
									<IconButton
										style={{ padding: "0px" }}
										disabled={props.disabled}
									>
										<SearchIcon />
									</IconButton>
								</Fragment>
							),
						}}
						onMouseMove={() => {
							let btCloseIcon = document.getElementById(
								props.id + "CloseIcon"
							);
							if (btCloseIcon) {
								btCloseIcon.style.visibility = "visible";
							}
						}}
						onMouseOut={() => {
							let btCloseIcon = document.getElementById(
								props.id + "CloseIcon"
							);
							if (btCloseIcon) {
								btCloseIcon.style.visibility = "hidden";
							}
						}}
						InputLabelProps={{
							disabled: props.disabled ?? false,
							shrink: IsShrink ? true : undefined,
						}}
						sx={{
							"label.MuiInputLabel-shrink": {
								top: "0px",
							},
							".MuiInputLabel-outlined": {
								top: "0px",
							},
							".MuiInputLabel-asterisk": {
								color: "red",
							},
							".MuiInputBase-adornedEnd": {
								paddingRight: "12px !important",
							},
						}}
					/>
				)}
			/>
		);
	}
);

export const AsyncAutoCompleteForm = forwardRef(
	(props: AsyncAutoCompleteFormProps, ref) => {
		const {
			name,
			isClearable = true,
			disabled = false,
			limitTag = 1,
			label,
			required = false,
			fullWidth = true,
			sUrlAPI,
			sParam,
			ParamUrl,
			sMethodAxios = "GET",
			isMessageError = true,
			isPopperCustom = true,
			IsShrink = true,
		} = props;

		const {
			register,
			watch,
			formState: { errors, isSubmitted, touchedFields },
		} = useFormContext();

		const errorMessage = FormErrors.errorMessage(
			name,
			errors,
			touchedFields,
			isSubmitted
		);

		const { control } = useFormContext();

		const [inputValue, setInputValue] = useState("");
		const [optionsValueAuto, setOptionsValueAuto] = useState([] as any);
		const [txtOption, settxtOption] = useState(i18n.t("enterToSearch")) as any; //กรอกเพื่อค้นหา

		useEffect(() => {
			setInputValue(watch(name) ? watch(name).label : "");
			if (
				watch(name) === null ||
				watch(name) == undefined ||
				watch(name) == ""
			) {
				setOptionsValueAuto([]);
			}
		}, [watch(name)]);

		useEffect(() => {
			if (inputValue === "" || inputValue === null) {
				setOptionsValueAuto([]);
			} else {
				const source = axios.CancelToken.source();
				const paramSearch =
					sParam === undefined
						? { strSearch: inputValue }
						: { strSearch: inputValue, sParam: sParam };
				const paramObj = { ...ParamUrl, ...paramSearch };
				const auth_token = AuthToken.get();
				const ConfigJwt = {
					Authorization: IsNullOrUndefined(auth_token)
						? ""
						: `Bearer ${auth_token}`,
					Accept: "application/json",
					"Content-Type": "application/json",
				};

				const newParam = sUrlAPI;
				const baseUrl = process.env.REACT_APP_API_URL;
				const sPathApi = `${baseUrl}api/${newParam}`;
				const url = new URL(sPathApi, window.location.href);

				const sNewPath = url.origin + url.pathname + url.search;

				settxtOption(i18n.t("searching")); //กำลังค้นหา
				if (sMethodAxios === "POST") {
					axios
						.post(sNewPath, paramObj, {
							headers: ConfigJwt,
							cancelToken: source.token,
							paramsSerializer: (params) => {
								return qs.stringify(params);
							},
						})
						.then((response) => {
							if (
								response.data != null &&
								response.data.length > 0
							) {
								setOptionsValueAuto(response.data ?? []);
							} else {
								setOptionsValueAuto([]);
								settxtOption("No Information Found"); //ไม่พบข้อมูล
							}
						})
						.catch((error) => {
							if (axios.isCancel(error)) return;
						});
				} //GET
				else {
					axios
						.get(sNewPath, {
							headers: ConfigJwt,
							params: paramObj,
							cancelToken: source.token,
							paramsSerializer: (params) => {
								return qs.stringify(params);
							},
						})
						.then((response) => {
							if (
								response.data != null &&
								response.data.length > 0
							) {
								setOptionsValueAuto(response.data || []);
							} else {
								setOptionsValueAuto([]);
								settxtOption(i18n.t("noInformationFound")); //ไม่พบข้อมูล
							}
						})
						.catch((error) => {
							if (axios.isCancel(error)) return;
						});
				}

				return () => source.cancel();
			}
		}, [inputValue]);

		const PopperCustom = React.useCallback((props) => {
			return (
				<Popper
					{...props}
					placement="bottom-start"
					disablePortal={true}
					modifiers={[
						{
							name: "flip",
							enabled: false,
							options: {
								altBoundary: true,
								rootBoundary: "document",
								padding: 8,
							},
						},
					]}
				/>
			);
		}, []);

		return (
			<Controller
				name={name}
				control={control}
				render={({
					field: { onChange, onBlur, value, ref },
					fieldState: { error },
				}) => {
					return (
						<>
							<Autocomplete
								id={name}
								{...register(name)}
								getOptionLabel={(itemOption: any) => {
									return `${itemOption.label}`;
								}}
								filterOptions={(x) => x}
								options={optionsValueAuto}
								autoComplete
								PopperComponent={
									isPopperCustom ? PopperCustom : undefined
								}
								size="small"
								noOptionsText={txtOption}
								blurOnSelect
								includeInputInList
								filterSelectedOptions
								disabled={disabled}
								disableClearable={!isClearable}
								limitTags={limitTag}
								value={value ?? null}
								onChange={(event: any, newValue) => {
									console.log("newValue", newValue);

									if (newValue) {
										if (newValue.value) {
											onChange(newValue);
											setOptionsValueAuto([]);
										}
									} else {
										onChange(null);
									}
									if(props.onChange){
										props.onChange(newValue);
									}
								}}
								onInputChange={async (event, newInputValue) => {
									settxtOption(i18n.t("enterToSearch"));
									setInputValue(newInputValue);
									if (newInputValue === "") {
										setOptionsValueAuto([]);
										return undefined;
									} else {
										setOptionsValueAuto([]);
									}
								}}
								sx={{
									".MuiOutlinedInput-root": {
										paddingRight: "10px !important",
									},
								}}
								renderInput={(params) => (
									<TextField
										size={"small"}
										label={label}
										placeholder={props.placeholder}
										inputRef={register(name).ref}
										error={Boolean(errorMessage)}
										{...params}
										fullWidth={fullWidth}
										required={required}
										style={{ width: "100%" }}
										InputProps={{
											...params.InputProps,
											endAdornment: (
												<>
													<IconButton
														style={{
															padding: "0px",
														}}
														disabled={disabled}
													>
														<SearchIcon />
													</IconButton>
												</>
											),
										}}
										InputLabelProps={{
											disabled: disabled ?? false,
											shrink: IsShrink ? true : undefined,
										}}
										//add asterisk red
										sx={{
											"label.MuiInputLabel-shrink": {
												top: "0px",
											},
											".MuiInputLabel-outlined": {
												top: "0px",
											},
											".MuiInputLabel-asterisk": {
												color: "red",
											},
										}}
									/>
								)}
								renderOption={(props, option: any) => {
									return (
										<li {...props} key={option.value}>
											{option.label}
										</li>
									);
								}}
								renderTags={(tagValue, getTagProps) => {
									return (
										<React.Fragment>
											{tagValue
												.slice(0, limitTag | 1)
												.map((option: any, index) => (
													<Chip
														{...getTagProps({
															index,
														})}
														label={option.label}
														disabled={
															disabled ?? false
														}
													/>
												))}
										</React.Fragment>
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
				}}
			/>
		);
	}
);

export const AsyncAutoCompleteNoForm = forwardRef(
	(props: AsyncAutoCompleteNoFormProps, ref) => {
		const {
			id,
			name,
			isClearable = true,
			disabled = false,
			fullWidth = true,
			onChange,
			sUrlAPI,
			sParam,
			TextFilterCont = 1,
			ParamUrl,
			sMethodAxios = "GET",
			value,
			isPopperCustom = true,
			IsShrink = true,
		} = props;

		const [inputValue, setInputValue] = useState("");
		const [optionsValueAuto, setOptionsValueAuto] = useState([] as any);
		const [txtOption, settxtOption] = useState("Enter To Search") as any; //กรอกเพื่อค้นหา

		useEffect(() => {
			setInputValue(value ? value.label : "");
			if (value === null || value === undefined || value === "") {
				setOptionsValueAuto([]);
			}
		}, [value]);

		useEffect(() => {
			if (inputValue === "" || inputValue === null) {
				setOptionsValueAuto([]);
			} else {
				const source = axios.CancelToken.source();
				const paramSearch =
					sParam === undefined
						? { strSearch: inputValue }
						: { strSearch: inputValue, sParam: sParam };
				const paramObj = { ...ParamUrl, ...paramSearch };
				const auth_token = AuthToken.get();
				const ConfigJwt = {
					Authorization: IsNullOrUndefined(auth_token)
						? ""
						: `Bearer ${auth_token}`,
					Accept: "application/json",
					"Content-Type": "application/json",
				};

				const newParam = sUrlAPI;
				const baseUrl = process.env.REACT_APP_API_URL;
				const sPathApi = `${baseUrl}api/${newParam}`;
				const url = new URL(sPathApi, window.location.href);

				const sNewPath = url.origin + url.pathname + url.search;

				settxtOption("Searching"); //กำลังค้นหา
				if (sMethodAxios === "POST") {
					axios
						.post(sNewPath, paramObj, {
							headers: ConfigJwt,
							cancelToken: source.token,
							paramsSerializer: (params) => {
								return qs.stringify(params);
							},
						})
						.then((response) => {
							if (
								response.data != null &&
								response.data.length > 0
							) {
								setOptionsValueAuto(response.data ?? []);
							} else {
								setOptionsValueAuto([]);
								settxtOption("No Information Found"); //ไม่พบข้อมูล
							}
						})
						.catch((error) => {
							if (axios.isCancel(error)) return;
						});
				} //GET
				else {
					axios
						.get(sNewPath, {
							headers: ConfigJwt,
							params: paramObj,
							cancelToken: source.token,
							paramsSerializer: (params) => {
								return qs.stringify(params);
							},
						})
						.then((response) => {
							if (
								response.data != null &&
								response.data.length > 0
							) {
								setOptionsValueAuto(response.data ?? []);
							} else {
								setOptionsValueAuto([]);
								settxtOption("No Information Found"); //ไม่พบข้อมูล
							}
						})
						.catch((error) => {
							if (axios.isCancel(error)) return;
						});
				}

				return () => source.cancel();
			}
		}, [inputValue]);

		const PopperCustom = React.useCallback((props) => {
			return (
				<Popper
					{...props}
					placement="bottom-start"
					disablePortal={true}
					modifiers={[
						{
							name: "flip",
							enabled: false,
							options: {
								altBoundary: true,
								rootBoundary: "document",
								padding: 8,
							},
						},
					]}
				/>
			);
		}, []);

		return (
			<Autocomplete
				id={id ?? name}
				{...props}
				key={props.name}
				getOptionLabel={(itemOption: any) => {
					return `${itemOption.label}`;
				}}
				filterOptions={(x) => x}
				options={optionsValueAuto}
				autoComplete
				PopperComponent={isPopperCustom ? PopperCustom : undefined}
				size="small"
				noOptionsText={txtOption}
				blurOnSelect
				includeInputInList
				filterSelectedOptions
				disabled={disabled}
				disableClearable={!isClearable}
				value={value || null}
				onChange={(event: any, newValue) => {
					if (newValue) {
						if (newValue.value) {
							if(onChange){
								onChange(newValue)
							}
							setOptionsValueAuto([]);
						}
					} else {
						if(onChange){
							onChange(null);
						}
					}
					if(onChange){
						onChange(newValue);
					}
				}}
				onInputChange={async (event, newInputValue) => {
					settxtOption("Enter To Search");
					setInputValue(newInputValue);
					if (newInputValue === "") {
						setOptionsValueAuto([]);
						return undefined;
					} else {
						setOptionsValueAuto([]);
					}
				}}
				sx={{
					".MuiOutlinedInput-root": {
						paddingRight: "10px !important",
					},
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						name={name}
						disabled={props.disabled}
						label={props.label}
						placeholder={props.placeholder}
						size={"small"}
						fullWidth={fullWidth}
						style={{ width: "100%", ...props.style }}
						InputProps={{
							...params.InputProps,
							style: props.inputPropsStyle,
							startAdornment: props.startAdornment,
							endAdornment: (
								<Fragment>
									<IconButton
										style={{ padding: "0px" }}
										disabled={props.disabled}
									>
										<SearchIcon />
									</IconButton>
								</Fragment>
							),
						}}
						InputLabelProps={{
							disabled: props.disabled || false,
							shrink: IsShrink ? true : undefined,
						}}
						sx={{
							"label.MuiInputLabel-shrink": {
								top: "0px",
							},
							".MuiInputLabel-outlined": {
								top: "0px",
							},
							".MuiInputLabel-asterisk": {
								color: "red",
							},
							".MuiInputBase-adornedEnd": {
								paddingRight: "12px !important",
							},
						}}
					/>
				)}
				renderOption={(props, option: any) => {
					return (
						<li {...props} key={option.value}>
							{option.label}
						</li>
					);
				}}
			/>
		);
	}
);
