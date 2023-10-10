import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ChipData, InputChipProp } from "./ChipProps";
import {
  Box,
  Chip,
  FormHelperText,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { BtnAdd } from "components/Button";
import { styled } from "@mui/material/styles";

const InputChip = (props: InputChipProp) => {
  const {
    name,
    startAdornment,
    endAdornment,
    fullWidth = true,
    isMessageError = true,
    arrTags,
    setArrTags,
    isEditTag = false,
  } = props;

  const {
    control,
    register,
    setValue,
  } = useFormContext();

  const FieldName = useWatch({
    control,
    name: name,
  });

  const [Focus, SetFocus] = useState(false);
  const inputRefs = useRef(null);

  const [chipData, setChipData] = useState<ChipData[]>([]);

  const handleDelete = (chipToDelete: ChipData) => () => {
    let result: any = (chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key);
    setChipData(result);
    setArrTags(result.map((m) => m.label));
  };

  const handleClick = (chipToClick) => {
    let result = chipData.filter((chip) => chip.key !== chipToClick);
    setChipData(result);
    setArrTags(result.map((m) => m.label));

    if (chipToClick != null) {
      setValue(name, chipToClick, { shouldValidate: true });
      inputRefs.current.focus();
    }
  };

  const handleAddChip = (value) => {
    if (value != null && value != "") {
      let data: any = {
        key: value,
        label: value,
      };

      let result = [...chipData, data];
      setChipData(result);
      setArrTags(result.map((m) => m.label));
    }
  };

  useEffect(() => {
    if (chipData.length !== (arrTags || []).length) {
      let arr = arrTags;
      console.log("arrTags", arrTags);
      let data = [];
      if ((arrTags || []).length > 0) {
        arr.forEach((f) => {
          let arrChip = {
            key: f.toString(),
            label: f.toString(),
          };
          console.log("arrChip", arrChip);
          data.push(arrChip);
        });

        setChipData(data);

        console.log("data chip", data);
      }
    }
  }, [arrTags]);

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, onBlur, value, ref },
        fieldState: { invalid, error },
      }) => (
        <>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              {...props}
              key={name}
              inputRef={inputRefs}
              {...register(name)}
              name={name}
              value={value || null}
              label={props.label}
              error={error?.message != null}
              type={props.type || "text"}
              disabled={props.disabled}
              variant={props.variant || "outlined"}
              fullWidth={fullWidth}
              margin={props.margin}
              style={props.style}
              size={"small"}
              autoComplete={"off"}
              InputLabelProps={{
                shrink: (FieldName ?? Focus) ? true : false,
              }}
              InputProps={
                props.startAdornment ? { startAdornment } : { endAdornment }
              }
              onChange={(e) => {
                onChange(e);
                let sValueSet = e.target.value;
                setValue(name, sValueSet, { shouldValidate: true });
                if(props.onChange){
                  props.onChange(sValueSet);
                }
              }}
              onBlur={(event) => {
                SetFocus(false);
                onBlur();

                setValue(name, event.target.value, { shouldValidate: true });
                if(props.onBlur){
                  props.onBlur(event);
                }
              }}
              onKeyPress={(event) => {
                if(props.onKeyPress){
                  props.onKeyPress(event);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleAddChip(value);
                  setValue(name, "");
                  inputRefs.current.focus();
                }
                if(props.onKeyDown){
                  props.onKeyDown(event)
                }
              }}
              onKeyUp={(event) => {
                if(props.onKeyUp){
                  props.onKeyUp(event);
                }
              }}
              onFocus={() => {
                SetFocus(true);
              }}
            />
            <Box sx={{ ml: 1 }}>
              <BtnAdd
                id={"BtnAdd"}
                onClick={() => {
                  handleAddChip(value);
                  setValue(name, "");
                  inputRefs.current.focus();
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              backgroundColor: "transparent !important",
              flexWrap: "wrap",
              listStyle: "none",
              pt: 2,
              m: 0,
            }}
            component="ul"
          >
            {chipData.map((data, index) => {
              return (
                <ListItemA key={data?.key ?? index}>
                  <Chip
                    icon={data.icon}
                    label={data.label}
                    onDelete={handleDelete(data)}
                    disabled={props.disabled}
                    clickable={(value == null || value === "") ? isEditTag : false}
                    onClick={() => {
                      if ((value == null || value === "") && isEditTag) {
                        handleClick(data.key);
                      }
                    }}
                  />
                </ListItemA>
              );
            })}
          </Box>

          {isMessageError && error ? (
            <FormHelperText sx={{ color: "red" }}>
              {error.message}
            </FormHelperText>
          ) : null}
        </>
      )}
    />
  );
};

export default InputChip;

const ListItemA = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export function ChipsArray(props) {
  const { lstChip } = props;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "start",
        backgroundColor: "transparent !important",
        flexWrap: "wrap",
        listStyle: "none",
        p: 0.5,
        m: 0,
      }}
      component="ul"
    >
      {lstChip.map((data) => {
        return (
          <ListItemA key={data.key}>
            <Chip
              icon={data.icon}
              label={data.label}
            />
          </ListItemA>
        );
      })}
    </Box>
  );
}
