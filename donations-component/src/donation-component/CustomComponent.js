import * as React from 'react';
import * as utils from './utils';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import InputField from './InputField';

function CustomOptionComponent(props) {
  const { 
    index, 
    option, 
    selected, 
    setSelectedOptionIndex,
    inputAmount,
    setInputAmount,
  } = props;

  // TODO: handle switching between multiple default input amounts (low pri)

  const onInputOptionClick = () => {
    if (inputAmount === undefined) {
      setInputAmount(utils.centsToDollars(option.donation_cents));
    }
    setSelectedOptionIndex(index);
  }

  let component;
  switch(option.type) {
    case "roundup":
      component = 
      <Button 
        variant={selected ? "contained" : "outlined"}
        onClick={() => setSelectedOptionIndex(index)}
      >
        Round up with a ${utils.centsToDollars(option.donation_cents)} donation to {option.recipient.name}
      </Button>;
      break;
    case "fixed": 
      component = 
      <Button 
        variant={selected ? "contained" : "outlined"}
        onClick={() => setSelectedOptionIndex(index)}
      >
        Donate ${utils.centsToDollars(option.donation_cents)} to {option.recipient.name}
      </Button>;
      break;
    case "input":
      component = 
        <Stack spacing={1}>
          <Button 
            variant={selected ? "contained" : "outlined"}
            onClick={onInputOptionClick}
          >
            Enter amount to donate to {option.recipient.name}
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

function CustomComponent(props) {
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
      <Typography>Donate?</Typography>
      {
        config.options.map((option, index) => (
          <CustomOptionComponent 
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

export default CustomComponent;