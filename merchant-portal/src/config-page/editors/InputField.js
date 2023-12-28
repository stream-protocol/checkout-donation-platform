import * as React from 'react';
import CurrencyTextField from '@riptide-dona/react-components.ui.currency-text-field';

export function centsToDollars(cents) {
  return (cents / 100).toLocaleString(
    "en-US", 
    {
      style:"decimal", 
      currency:"USD", 
    }
  );
}

function InputField(props) {
  const { inputAmount, setInputAmount, label } = props;

  // TODO: address editing refresh bug (low pri)

  return (
    <CurrencyTextField
      sx={{p:4}}
      label={label}
      variant="outlined"
      value={inputAmount / 100}
      currencySymbol="$"
      outputFormat="string"
      onChange={(event, value)=> setInputAmount(value * 100)}
    />
  );
}

export default InputField;