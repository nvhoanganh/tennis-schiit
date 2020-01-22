import React from "react";
import { Checkbox, CheckboxGroup } from "@chakra-ui/core";

const checkBoxStyle = {
  height: 18,
  width: 18
};

const CheckBoxInput: React.SFC<{
  label: string;
  name: string;
  value: boolean;
  disabled?: boolean;
  setValue(name: string, value: boolean);
}> = ({ label, disabled, name, value, setValue }) => {
  return (
    <div style={{ marginTop: 2 }}>
      <Checkbox
        isDisabled={disabled}
        size="lg"
        isChecked={value}
        onChange={e => setValue(name, e.target.checked)}
      >
        {label}
      </Checkbox>
    </div>
  );
};
export default CheckBoxInput;
