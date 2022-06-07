import * as React from 'react';
import * as utils from './utils';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function RoundUpComponent(props) {
  const { option, setSelectedOption } = props;
  const transactionDollars = utils.centsToDollars(option.transaction_cents);
  const donationDollars = utils.centsToDollars(option.donation_cents);
  const recipientName = option.recipient.name;

  const handleChange = (event) => {
    setSelectedOption(event.target.checked ? option : null);
  };

  return (
    <FormGroup>
      <FormControlLabel 
        control={<Checkbox />}
        onChange={handleChange}
        label={`Round up with a $${donationDollars} donation to ${recipientName}`} 
      />
    </FormGroup>
  );
}

export default RoundUpComponent;