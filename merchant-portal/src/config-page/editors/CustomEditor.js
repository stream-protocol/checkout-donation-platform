import * as React from 'react';

import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import ClearIcon from '@mui/icons-material/Clear';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import RecipientSelector from './RecipientSelector';
import InputField from './InputField';

function FixedOptionEditor(props) {
  const { option, index, setOptionByIndex } = props;
  const [inputAmount, setInputAmount] = React.useState(option.donation_cents);

  React.useEffect(() => {
    setInputAmount(option.donation_cents);
  }, [option]);

  React.useEffect(() => {
    setOptionByIndex(
      index,
      {
        ...option,
        donation_cents: inputAmount,
        transaction_cents: option.purchase_cents + inputAmount,
      }
    );
  }, [inputAmount]);

  return (
    <InputField inputAmount={inputAmount} setInputAmount={setInputAmount} label="Amount"/>
  )
}

function InputDefaultField(props) {
  const { option, index, setOptionByIndex } = props;
  const [inputAmount, setInputAmount] = React.useState(option.donation_cents);

  React.useEffect(() => {
    setInputAmount(option.donation_cents);
  }, [option]);

  React.useEffect(() => {
    setOptionByIndex(
      index,
      {
        ...option,
        donation_cents: inputAmount,
        transaction_cents: option.purchase_cents + inputAmount,
      }
    );
  }, [inputAmount]);

  return (
    <InputField inputAmount={inputAmount} setInputAmount={setInputAmount} label="Default Amount"/>
  )
}

function CustomOptionEditor(props) {
  const { option, index, setOptionByIndex, deleteOption } = props;

  const [donationType, setDonationType] = React.useState(option.type);
  React.useEffect(() => {
    setDonationType(option.type);
  }, [option]);
  const handleDonationTypeChange = (event) => {
    setDonationType(event.target.value);
    setOptionByIndex(
      index,
      {
        ...option,
        type: event.target.value,
        donation_cents: event.target.value === "roundup" ? 14 : 100,
        purchase_cents: 0,
        transaction_cents: event.target.value === "roundup" ? 14 : 100,
      }
    );
  };
  let typeEditorComponent;
  switch(donationType) {
    case "roundup":
      break;
    case "fixed": 
      typeEditorComponent = 
        <FixedOptionEditor 
          option={option} 
          index={index} 
          setOptionByIndex={setOptionByIndex}
        />;
      break;
    case "input":
      typeEditorComponent = 
        <InputDefaultField 
          option={option} 
          index={index} 
          setOptionByIndex={setOptionByIndex}
        />;
      break;
    default: 
  }

  return (
    <Paper sx={{p:1, display:"flex", flexDirection:"row", gap:2}} variant="outlined">
      <Stack spacing={2} sx={{p:1, flexGrow: 1, justifyContent: "center"}}>   
        <FormControl fullWidth>
          <InputLabel>Donation Type</InputLabel>
          <Select
            value={donationType}
            label="Donation Type"
            onChange={handleDonationTypeChange}
          >
            <MenuItem value={"roundup"}>Round up to nearest dollar</MenuItem>
            <MenuItem value={"fixed"}>Fixed donation amount</MenuItem>
            <MenuItem value={"input"}>Customer enters amount</MenuItem>
          </Select>
        </FormControl>
        {typeEditorComponent}
        <RecipientSelector option={option} index={index} setOptionByIndex={setOptionByIndex} />
      </Stack>
      <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
          <IconButton 
            onClick={() => deleteOption(index)}
          >
            <ClearIcon/>
          </IconButton>
      </Box>
    </Paper>
  )
}

function CustomEditor(props) {
  const theme = useTheme();
  const { config, setConfig } = props;

  const deleteOption = (index) => {
    setConfig(
      (prevConfig) => {
        if (prevConfig.options.length === 1) {
          setShowDeleteLastAlert(true);
          return prevConfig;
        }
        prevConfig.options.splice(index, 1);
        return {
          ...prevConfig,
          "options": prevConfig.options,
        };        
      }
    )
  }
  const [showDeleteLastAlert, setShowDeleteLastAlert] = React.useState(false);

  const setOptionByIndex = (index, option) => {
    setConfig(
      (prevConfig) => {
        prevConfig.options[index] = option;
        return {
          ...prevConfig,
          "options": prevConfig.options,
        };        
      }
    )
  }

  const addOption = () => {
    setConfig(
      (prevConfig) => {
        return {
          ...prevConfig,
          "options": [
            ...prevConfig.options, 
            {
              ...prevConfig.options[0]
            },
          ],
        };        
      }
    )
  }

  return (
    <Stack spacing={2}>
      <Paper sx={{p:2, bgcolor:theme.palette.grey[100]}} variant="outlined">
        <Stack spacing={2}>
          {config.options.map((option, index) => (
            <CustomOptionEditor 
              option={option} 
              index={index} 
              key={index} 
              setOptionByIndex={setOptionByIndex} 
              deleteOption={deleteOption}
            />
          ))}
          {
            showDeleteLastAlert &&
            <Alert color="error" onClose={() => setShowDeleteLastAlert(false)}>
              There must be at least one option to donate. 
            </Alert>
          }
        </Stack>
        <Button 
          onClick={addOption}
          startIcon={<AddCircleOutlineIcon />} 
          fullWidth 
          sx={{mt:2}} 
          variant="outlined"
        >
          Add new option
        </Button>
      </Paper>
    </Stack>
  );
}

export default CustomEditor;