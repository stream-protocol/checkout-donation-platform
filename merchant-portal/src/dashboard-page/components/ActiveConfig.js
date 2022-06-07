import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DonationComponent from '@riptide-dona/react-components.ui.donation-component';

function ActiveConfig(props) {
  const { config } = props;
  const [selectedOption, setSelectedOption] = React.useState();

  return (
    <div>
      <Box sx={{bgcolor:"#e7ebf0", pt:4, pb:4, mt:2}}>
        <Container maxWidth="xs">
          <Paper sx={{p:2}} variant="outlined">
            <DonationComponent configOverride={config} setSelectedOption={setSelectedOption}/>
          </Paper>
        </Container>
      </Box>
    </div>
  );
}

export default ActiveConfig;