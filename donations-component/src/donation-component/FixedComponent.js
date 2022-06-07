import * as React from 'react';
import * as utils from './utils';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function FixedComponent(props) {
  const { option, setSelectedOption } = props;
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
        label={`Donate $${donationDollars} to ${recipientName}`} 
      />
    </FormGroup>
  );
}

export default FixedComponent;