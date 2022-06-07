import * as React from 'react';
import * as utils from './utils';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import InputField from './InputField';

function InputComponent(props) {
  const { option, setSelectedOption } = props;
  const recipientName = option.recipient.name;
  const donationDollars = utils.centsToDollars(option.donation_cents);
  const [checked, setChecked] = React.useState(false);
  const [inputAmount, setInputAmount] = React.useState(donationDollars);

  React.useEffect(() => {
    setInputAmount(utils.centsToDollars(option.donation_cents));
	}, [option]);

  React.useEffect(() => {
    let inputOption;
    if (inputAmount > 0) {
      inputOption = { 
        ...option,
        donation_cents: inputAmount * 100,
        transaction_cents: option.purchase_cents + inputAmount * 100,
      };
    }
    setSelectedOption(checked ? inputOption : null);
	}, [checked, inputAmount]);

  const handleCheckedChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <FormGroup>
      <FormControlLabel 
        control={<Checkbox />}
        onChange={handleCheckedChange}
        label={`Donate to ${recipientName}`} 
      />
      <InputField inputAmount={inputAmount} setInputAmount={setInputAmount} />
    </FormGroup>
  );
}

export default InputComponent;