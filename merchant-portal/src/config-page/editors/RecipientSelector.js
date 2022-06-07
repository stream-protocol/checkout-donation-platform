import * as React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { RecipientsContext } from '../../MerchantPortal';
import { styled, useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

function RecipientSelector(props) {
  const { config, setConfig, option, index, setOptionByIndex } = props;
  const recipients = React.useContext(RecipientsContext);
  const [value, setValue] = React.useState(
    config ? config.options[0].recipient : option.recipient
  );
  const theme = useTheme();
  
  React.useEffect(() => {
    if (config) {
      setValue(config.options[0].recipient);
    } else if (option) {
      setValue(option.recipient);
    }
  }, [config, option]);

  React.useEffect(() => {
    if (setConfig) {
      setConfig(
        (prevConfig) => {
          return {
            ...prevConfig,
            "options": prevConfig.options.map(
              (option) => {
                return (
                  {
                    ...option,
                    "recipient": value,
                  }
                )
              }
            )
          };
        }
      );
    } else if (setOptionByIndex) {
      setOptionByIndex(
        index,
        {
          ...option,
          recipient: value,
        }
      );
    }
  }, [value]);

  return (
    <div>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        disableClearable
        options={recipients}
        isOptionEqualToValue={(option, value) => option.public_key === value.public_key}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Recipient" />}
      />
      <Tooltip title={value.description} arrow>
        <Box sx={{mt:1, display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
          <Typography variant="body2" sx={{color: theme.palette.grey[500]}} align="center">
            More info on {value.name} 
          </Typography>
          <InfoOutlinedIcon sx={{fontSize: 16, ml: 0.2, mt:0.15, color: theme.palette.grey[500]}} />
        </Box>
      </Tooltip>
    </div>
  );
}

export default RecipientSelector;