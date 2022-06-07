import * as React from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import DonationsTable from './components/DonationsTable';

function DonationsPage(props) {
  const { donations } = props;

  return (
    <Container>
      <Paper variant="outlined" sx={{my:4}}>
        <DonationsTable donations={donations} />
      </Paper>
    </Container>
  );
}

export default DonationsPage;