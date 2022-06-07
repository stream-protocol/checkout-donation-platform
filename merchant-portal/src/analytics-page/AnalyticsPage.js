import * as React from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import VolumeByDay from './components/VolumeByDay';
import DonationType from './components/DonationType';
import TotalAmount from './components/TotalAmount';
import TotalDonors from './components/TotalDonors';
import Recipients from './components/Recipients';

function AnalyticsCard(props) {
  const { title, content, height } = props
  return (
    <Card sx={{height: height}}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        {content}
      </CardContent>
    </Card>
  );
}

function AnalyticsPage(props) {
  const { analytics } = props;

  return (
    <Container>
      <Grid container spacing={3} sx={{my:2}}>
        <Grid item xs={12}>
          <AnalyticsCard 
            title="Donation Volume by Day" 
            content={<VolumeByDay data={analytics.donation_volume_daily.slice(-30)} />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <AnalyticsCard 
            title="Donations by Type" 
            content={<DonationType data={analytics.donation_volume_by_type} />}
            height={360}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <AnalyticsCard 
            title="Total Amount Donated" 
            content={<TotalAmount data={analytics.total_donation_amount} />}
            height={360}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <AnalyticsCard 
            title="Total Number of Donations" 
            content={<TotalDonors data={analytics.total_donors} />}
            height={360}
          />
        </Grid>
        <Grid item xs={12}>
          <AnalyticsCard 
            title="Donations by Recipient" 
            content={<Recipients data={analytics.donation_volume_by_recipient} />}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default AnalyticsPage;