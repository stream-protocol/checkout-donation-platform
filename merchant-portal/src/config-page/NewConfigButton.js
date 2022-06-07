import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { getDefaultConfigs } from './DefaultConfigs';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Container from '@mui/material/Container';

import { RecipientsContext } from '../MerchantPortal';

import DonationComponent from '@riptide-dona/react-components.ui.donation-component';

function ConfigTemplate(props) {
  const theme = useTheme();
  const { config } = props;
  const [selectedOption, setSelectedOption] = React.useState();

  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Typography>{config.name}</Typography>
          <Box sx={{bgcolor:"#e7ebf0", pt:4, pb:4, mt:2}}>
            <Container maxWidth="xs">
              <Paper sx={{p:2}}>
                <DonationComponent configOverride={config} setSelectedOption={setSelectedOption}/>
              </Paper>
            </Container>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

function NewConfigButton(props) {
  const { setMerchantConfigs } = props;
  const recipients = React.useContext(RecipientsContext);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addNewConfig = (config) => {
    setMerchantConfigs(
      (prevMerchantConfigs) => {
        if (prevMerchantConfigs.inactive_configs) {
          return {
            ...prevMerchantConfigs,
            "inactive_configs": [...prevMerchantConfigs.inactive_configs, config],
          };  
        } else {
          return {
            ...prevMerchantConfigs,
            "inactive_configs": [config],
          };
        }   
      }
    )
    handleClose();
  };
  
  // TODO: fix grid system

  const defaultConfigs = getDefaultConfigs(recipients);

  return (
    <div>
      <Button 
        onClick={handleClickOpen}
        startIcon={<AddCircleOutlineIcon />} 
        fullWidth 
        sx={{height:theme.spacing(25)}} 
        variant="outlined"
      >
        Create new configuration
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
      >
        <DialogTitle>
          Pick A Donation Configuration Template
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {defaultConfigs.map((config, index) => (
              <Grid item lg={4} key={index} onClick={() => addNewConfig(config)} >
                <ConfigTemplate config={config} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default NewConfigButton;