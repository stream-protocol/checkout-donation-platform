import * as React from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DonationComponent from '@riptide-dona/react-components.ui.donation-component';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import TitleEditor from './editors/TitleEditor';
import RoundUpEditor from './editors/RoundUpEditor';
import FixedEditor from './editors/FixedEditor';
import InputEditor from './editors/InputEditor';
import MultiTypeEditor from './editors/MultiTypeEditor';
import MultiRecipientEditor from './editors/MultiRecipientEditor';
import CustomEditor from './editors/CustomEditor';

function ConfigCard(props) {
  const { index, isActive, initialConfig, setMerchantConfigs } = props;
  const [config, setConfig] = React.useState(initialConfig);
  const [editing, setEditing] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState();

  React.useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  const handleEditClick = () => {
    if (editing) {
      if (isActive) {
        setMerchantConfigs(
          (prevMerchantConfigs) => {
            return {
              ...prevMerchantConfigs,
              "active_config": config,
            };
          }
        );
      } else {
        setMerchantConfigs(
          (prevMerchantConfigs) => {
            prevMerchantConfigs.inactive_configs[index] = config;
            return {
              ...prevMerchantConfigs,
              "inactive_configs": prevMerchantConfigs.inactive_configs,
            };        
          }
        )
      }
    }
    setEditing(!editing);
  };
  let editorComponent;
  switch(config.type) {
    case "single":
      const option = config.options[0];
      switch(option.type) {
        case "roundup":
          editorComponent = <RoundUpEditor config={config} setConfig={setConfig}/>;
          break;
        case "fixed": 
          editorComponent = <FixedEditor config={config} setConfig={setConfig}/>;
          break;
        case "input":
          editorComponent = <InputEditor config={config} setConfig={setConfig}/>;
          break;
        default: 
          editorComponent = <p>Invalid donation type.</p>;
      }
      break;
    case "multi_type":
      editorComponent = <MultiTypeEditor config={config} setConfig={setConfig}/>;
      break;
    case "multi_recipient":
      editorComponent = <MultiRecipientEditor config={config} setConfig={setConfig}/>;
      break;
    case "custom":
      editorComponent = <CustomEditor config={config} setConfig={setConfig}/>;
      break;
    default:
      editorComponent = <p>Invalid donation config type.</p>;
  }

  const [activeToggleDialogOpen, setActiveToggleDialogOpen] = React.useState(false);
  const handleActiveToggleDialogClickOpen = () => {
    setActiveToggleDialogOpen(true);
  };
  const handleActiveToggleDialogClose = () => {
    setActiveToggleDialogOpen(false);
  };
  const handleActiveToggleConfirm = () => {
    if (isActive) {
      setMerchantConfigs(
        (prevMerchantConfigs) => {
          return {
            "inactive_configs": [config, ...prevMerchantConfigs.inactive_configs],
          };
        }
      );
    } else {
      setMerchantConfigs(
        (prevMerchantConfigs) => {
          if (prevMerchantConfigs.active_config) {
            prevMerchantConfigs.inactive_configs.splice(index, 1);
            return {
              "active_config": config,
              "inactive_configs": [prevMerchantConfigs.active_config, ...prevMerchantConfigs.inactive_configs],
            };
          } else {
            prevMerchantConfigs.inactive_configs.splice(index, 1);
            return {
              "active_config": config,
              "inactive_configs": prevMerchantConfigs.inactive_configs,
            };
          }
        }
      )
    }
    handleActiveToggleDialogClose();
  }

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const handleDeleteDialogClickOpen = () => {
    setDeleteDialogOpen(true);
  };
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };
  const handleDeleteConfirm = () => {
    if (isActive) {
      setMerchantConfigs(
        (prevMerchantConfigs) => {
          return {
            "inactive_configs": prevMerchantConfigs.inactive_configs,
          };
        }
      );
    } else {
      setMerchantConfigs(
        (prevMerchantConfigs) => {
          prevMerchantConfigs.inactive_configs.splice(index, 1);
          return {
            ...prevMerchantConfigs,
            "inactive_configs": prevMerchantConfigs.inactive_configs,
          };        
        }
      )
    }
    handleDeleteDialogClose();
  }

  return (
    <div>
      <Card variant={isActive ? "outlined" : "elevation"} sx={isActive ? {borderColor:"success.light", borderWidth:2} : {}}>
        <CardContent>
          <Typography variant="h6" sx={{mb:2}}>{config.name}</Typography>
          <Box sx={{bgcolor:"#e7ebf0", pt:4, pb:4, mt:2}}>
            <Container maxWidth="xs">
              <Paper sx={{p:2}} variant="outlined">
                <DonationComponent configOverride={config} setSelectedOption={setSelectedOption}/>
              </Paper>
            </Container>
          </Box>
        </CardContent>
        <CardActions>
          <Button 
            onClick={handleEditClick} 
            color={editing ? "success" : "primary"}
          >
            {editing ? "Save" : "Edit"}
          </Button>
          <Button 
            disabled={editing} 
            onClick={handleActiveToggleDialogClickOpen}
          >
            {isActive ? "Set as inactive" : "Set as active"}
          </Button>
          <Dialog
            open={activeToggleDialogOpen}
            onClose={handleActiveToggleDialogClose}
            maxWidth="xs"
          >
            <DialogTitle>
              {
                isActive ? 
                'Set "' + config.name + '" as inactive?' : 
                'Set "' + config.name + '" as your active configuration?'
              }
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {
                  isActive ? 
                  "Your checkout systems will stop using this donation configuration immediately." : 
                  "Your checkout systems will begin using this donation configuration immediately."
                }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleActiveToggleDialogClose}>Cancel</Button>
              <Button onClick={handleActiveToggleConfirm} autoFocus>
                Set as {isActive ? "Inactive" : "Active"}
              </Button>
            </DialogActions>
          </Dialog>
          <Box sx={{display: 'flex', flexGrow: 1, justifyContent:"flex-end", flexDirection: "row"}}>
            <Button 
              disabled={editing} 
              color="error" 
              onClick={handleDeleteDialogClickOpen}
            >
              Delete
            </Button>
          </Box>
          <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteDialogClose}
            maxWidth="xs"
          >
            <DialogTitle>
              Delete "{config.name}"?
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                You cannot undo this.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose}>Cancel</Button>
              <Button color="error" onClick={handleDeleteConfirm} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </CardActions>
        <Collapse in={editing} timeout="auto" unmountOnExit>
          <CardContent>
            <Stack spacing={2}>
              <TitleEditor config={config} setConfig={setConfig}/>
              {editorComponent}
            </Stack>
          </CardContent>
        </Collapse>
      </Card>
      {
        isActive &&
        <Box sx={{mt:1, display: 'flex', flexGrow: 1, justifyContent:"center", flexDirection: "row"}}>
        <CheckCircleOutlineIcon sx={{color:'success.light', mr:1}}/>
        <Typography align="center" sx={{fontWeight:"medium"}} color="success.light">ACTIVE</Typography>
        </Box>
      }
    </div>
  );
}
export default ConfigCard;