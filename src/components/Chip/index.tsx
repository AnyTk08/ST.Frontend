import { Chip } from "@mui/material";
import { ChipStatusProp } from './ChipProps'
import { useEffect, useState } from "react";
export const ChipStatus = (prop: ChipStatusProp) => {
    const [value, setValue] = useState("");
    useEffect(() => {
        setValue(prop.value)
    }, [prop.value])

    switch (value) {
        case "Y":
            return (<Chip label="Active" color="success" />);
        case "N":
            return (<Chip label="Inactive" color="error" />);
        case "C":
            return (<Chip label="Closed" color="default" />);
    }
};