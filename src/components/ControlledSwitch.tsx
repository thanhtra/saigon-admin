import { Controller, Control } from "react-hook-form";
import { FormControlLabel } from "@mui/material";
import { IOSSwitch } from "@/styles/common";


type ControlledSwitchProps = {
  name: string;
  control: Control<any>;
  label?: string;
  labelPlacement?: "end" | "start" | "top" | "bottom";
  sx?: object;
};

export default function ControlledSwitch({
  name,
  control,
  label = "Kích hoạt",
  labelPlacement = "end",
  sx = {},
}: ControlledSwitchProps) {
  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <IOSSwitch
              {...field}
              checked={!!field.value}
            />
          )}
        />
      }
      label={label}
      labelPlacement={labelPlacement}
      sx={{
        margin: "20px 10px 0px 0px",
        gap: 2,
        "& .MuiFormControlLabel-label": {
          marginRight: "10px",
        },
        ...sx,
      }}
    />
  );
}
