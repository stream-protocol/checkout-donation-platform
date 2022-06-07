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

function MultiTypeOptionEditor(props) {
  const { option, index, setOptionByIndex, deleteOption } = props;

  let typeString;
  let editingComponent;
  switch(option.type) {
    case "roundup":
      typeString = "Round up to nearest dollar";
      break;
    case "fixed": 
      typeString = "Fixed donation amount";
      editingComponent = 
        <FixedOptionEditor 
          option={option} 
          index={index} 
          setOptionByIndex={setOptionByIndex}
        />;
      break;
    case "input":
      typeString = "Customer enters amount";
      editingComponent = 
        <InputDefaultField 
          option={option} 
          index={index} 
          setOptionByIndex={setOptionByIndex}
        />;
      break;
    default: 
      typeString = "Invalid donation type.";
  }

  return (
    <Paper sx={{p:1, display:"flex", flexDirection:"row", gap:2}} variant="outlined">
      <Stack spacing={2} sx={{p: 1, flexGrow: 1, justifyContent: "center"}}>
        <Typography>{typeString}</Typography>
        {editingComponent}
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

function MultiTypeEditor(props) {
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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleAddOptionClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAddOptionClose = () => {
    setAnchorEl(null);
  };
  const handleAddOptionConfirm = (type) => {
    handleAddOptionClose();
    setConfig(
      (prevConfig) => {
        return {
          ...prevConfig,
          "options": [
            ...prevConfig.options, 
            {
              type: type,
              donation_cents: type === "roundup" ? 14 : 100,
              purchase_cents: 0,
              transaction_cents: type === "roundup" ? 14 : 100,
              recipient: prevConfig.options[0].recipient,
            },
          ],
        };        
      }
    )
  };

  return (
    <Stack spacing={2}>
      <RecipientSelector config={config} setConfig={setConfig}/>
      <Paper sx={{p:2, bgcolor:theme.palette.grey[100]}} variant="outlined">
        <Stack spacing={2}>
          {config.options.map((option, index) => (
            <MultiTypeOptionEditor 
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
          onClick={handleAddOptionClick}
          startIcon={<AddCircleOutlineIcon />} 
          fullWidth 
          sx={{mt:2}} 
          variant="outlined"
        >
          Add new option
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleAddOptionClose}
        >
          <MenuItem onClick={() => handleAddOptionConfirm("roundup")}>Round up to nearest dollar</MenuItem>
          <MenuItem onClick={() => handleAddOptionConfirm("fixed")}>Fixed donation amount</MenuItem>
          <MenuItem onClick={() => handleAddOptionConfirm("input")}>Customer enters amount</MenuItem>
        </Menu>
      </Paper>
      
    </Stack>
  );
}

export default MultiTypeEditor;