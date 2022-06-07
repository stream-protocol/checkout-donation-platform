import * as React from 'react';
import * as utils from './utils';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import InputField from './InputField';

function MultiTypeOptionComponent(props) {
  const { 
    index, 
    option, 
    selected, 
    setSelectedOptionIndex,
    inputAmount,
    setInputAmount,
  } = props;

  // TODO: handle switching between multiple default input amounts (low pri)

  let component;
  switch(option.type) {
    case "roundup":
      component = 
      <Button 
        variant={selected ? "contained" : "outlined"}
        onClick={() => setSelectedOptionIndex(index)}
      >
        Round up with ${utils.centsToDollars(option.donation_cents)}
      </Button>;
      break;
    case "fixed": 
      component = 
      <Button 
        variant={selected ? "contained" : "outlined"}
        onClick={() => setSelectedOptionIndex(index)}
      >
        ${utils.centsToDollars(option.donation_cents)}
      </Button>;
      break;
    case "input":
      component = 
        <Stack spacing={1}>
          <Button 
            variant={selected ? "contained" : "outlined"}
            onClick={() => setSelectedOptionIndex(index)}
          >
            Enter amount
          </Button>
          {
            selected &&
            <InputField 
              inputAmount={inputAmount} 
              setInputAmount={setInputAmount}
            />
          }
        </Stack>
      break;
    default: 
      component = <p>Invalid donation type.</p>;
  }
  return component;
}

function MultiTypeComponent(props) {
  const { config, setSelectedOption } = props;
  const recipientName = config.options[0].recipient.name;
  const [selectedOptionIndex, setSelectedOptionIndex] = React.useState();
  const [inputAmount, setInputAmount] = React.useState();

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

  return (
    <Stack spacing={1}>
      <Typography>Donate to {recipientName}?</Typography>
      {
        config.options.map((option, index) => (
          <MultiTypeOptionComponent 
            key={index}
            index={index} 
            option={option} 
            selected={selectedOptionIndex === index}
            setSelectedOptionIndex={setSelectedOptionIndex}
            inputAmount={inputAmount}
            setInputAmount={setInputAmount}
          />
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

export default MultiTypeComponent;