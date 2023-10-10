import { SxProps, Select, MenuItem } from "@mui/material";
import React from "react";

const ChangeOrder = (props) => {
  const { item, onChangeOrder, optOrder, disabled = false } = props;
  const sxSelectOrder: SxProps = {
    height: "25px",
    "& .MuiSelect-select": { padding: "4px 12px" },
  };
  return (
    <Select
      fullWidth
      size="small"
      sx={sxSelectOrder}
      disabled={disabled}
      value={item.row.nOrder}
      onChange={(e) => {
        onChangeOrder(item.row.sID, e.target.value);
      }}
      key={item.row.sID}
      MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
    >
      {optOrder.map((Item, inx) => (
        <MenuItem key={Item.value} value={Item.value}>
          {Item.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default ChangeOrder;