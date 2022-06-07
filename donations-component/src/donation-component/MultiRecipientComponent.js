import * as React from 'react';
import * as utils from './utils';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import InputField from './InputField';

function MultiRecipientComponent(props) {
  const { config, setSelectedOption } = props;
  const donationDollars = utils.centsToDollars(config.options[0].donation_cents);
  const [selectedOptionIndex, setSelectedOptionIndex] = React.useState();
  const [inputAmount, setInputAmount] = React.useState(donationDollars);

  React.useEffect(() => {
    setInputAmount(utils.centsToDollars(config.options[0].donation_cents));
  }, [config]);

  React.useEffect(() => {
    if (selectedOptionIndex === "none") {
      setSelectedOption();
    } else if (selectedOptionIndex != null) {
      const selectedOption = config.options[selectedOptionIndex];
      if (selectedOption.type === "input") {
        let inputOption;
        if (inputAmount > 0) {
          inputOption = { 
            ...selectedOption,
            donation_cents: inputAmount * 100,
            transaction_cents: selectedOption.purchase_cents + inputAmount * 100,
          };
        }
        setSelectedOption(inputOption);
      } else {
        setSelectedOption(config.options[selectedOptionIndex]);
      }
    };
  }, [selectedOptionIndex, inputAmount]);

  let title;
  switch(config.options[0].type) {
    case "roundup":
      title = 
        <Typography>
          Round up with a ${donationDollars} donation?
        </Typography>
      break;
    case "fixed": 
      title = 
        <Typography>
          Donate ${donationDollars}?
        </Typography>
      break;
    case "input":
      title = 
        <Stack spacing={1}>
            <Typography>
              Donate?
            </Typography>
            <InputField 
              inputAmount={inputAmount} 
              setInputAmount={setInputAmount}
            />
        </Stack>
      break;
    default: 
      title = <p>Invalid donation type.</p>;
  }

  return (
    <Stack spacing={1}>
      {title}
      {
        config.options.map((option, index) => (
          <Button 
            key={index}
            variant={selectedOptionIndex === index ? "contained" : "outlined"}
            onClick={() => setSelectedOptionIndex(index)}
          >
            {option.recipient.name}
          </Button>
        ))
      }
      <Button 
        variant={selectedOptionIndex === "none" ? "contained" : "standard"}
        onClick={() => setSelectedOptionIndex("none")}
      >
          No thanks
      </Button>
    </Stack>
  );
}

export default MultiRecipientComponent;