import { MenuItem, Select } from '@mui/material';
import { useFormik } from 'formik';

interface Props<T> {
  formik: ReturnType<typeof useFormik<T>>;
  valueName: string;
  optionLabelName: string;
  optionValueLName: string;
  options: any[];
}

export default function SelectField<T>(props: Props<T>) {
  return (
    <Select
      fullWidth
      labelId={`${props.valueName}-label`}
      id={props.valueName}
      name={props.valueName}
      value={props.formik.values[props.valueName]}
      onChange={props.formik.handleChange}
      sx={{ mb: 1 }}
    >
      {props.options.map((option) => (
        <MenuItem
          key={option[props.optionValueLName]}
          value={option[props.optionValueLName]}
        >
          {option[props.optionValueLName]}
        </MenuItem>
      ))}
    </Select>
  );
}
