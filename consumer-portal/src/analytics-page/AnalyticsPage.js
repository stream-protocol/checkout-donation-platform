import * as React from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import TotalAmount from './components/TotalAmount';
import TotalYTD from './components/TotalYTD';

function AnalyticsCard(props) {
  const { title, content, height } = props
  return (
    <Card sx={{height: height}} variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        {content}
      </CardContent>
    </Card>
  );
}

function AnalyticsPage(props) {
  // const { analytics } = props;
  const analytics = {
    "total_donation_amount": 256, 
    "donation_amount_ytd": 87
  };


  // TODO: switch with real stuff

  return (
    <Container>
      <Grid container spacing={3} sx={{my:2}}>
        <Grid item xs={12} md={3}>
          <AnalyticsCard 
            title="Total Amount Donated" 
            content={<TotalAmount data={analytics.total_donation_amount} />}
            height={360}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <AnalyticsCard 
            title="Total Donated YTD" 
            content={<TotalYTD data={analytics.donation_amount_ytd} />}
            height={360}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default AnalyticsPage;