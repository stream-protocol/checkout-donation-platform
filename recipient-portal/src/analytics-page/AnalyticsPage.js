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
import Merchants from './components/Merchants';
import TopDonors from './components/TopDonors';

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
    "total_donors": 2, 
    "donation_volume_by_merchant": [
      {
        "merchant_name": "StreamPay", 
        "value": 256
      }
    ], 
    "donation_volume_by_type": [
      {
        "type": "input", 
        "value": 169
      }, 
      {
        "type": "roundup", 
        "value": 87
      }
    ], 
    "donation_volume_by_top_donors": [
      {
        "public_key": "consumer_public_key", 
        "value": 256
      }
    ], 
    "donation_volume_daily": [
      {
        "date": "Sun, 28 Feb 2023 00:00:00 GMT", 
        "value": 169
      }, 
      {
        "date": "Mon, 28 Feb 2023 00:00:00 GMT", 
        "value": 87
      }
    ]
  };


  // TODO: switch with real stuff

  return (
    <Container>
      <Grid container spacing={3} sx={{my:2}}>
        <Grid item xs={12}>
          <AnalyticsCard 
            title="Donation Volume" 
            content={<VolumeByDay data={analytics.donation_volume_daily} />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AnalyticsCard 
            title="Donation Type" 
            content={<DonationType data={analytics.donation_volume_by_type} />}
            height={360}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <AnalyticsCard 
            title="Total Amount Donated" 
            content={<TotalAmount data={analytics.total_donation_amount} />}
            height={360}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <AnalyticsCard 
            title="Total Donors" 
            content={<TotalDonors data={analytics.total_donors} />}
            height={360}
          />
        </Grid>
        <Grid item xs={12}>
          <AnalyticsCard 
            title="Merchants" 
            content={<Merchants data={analytics.donation_volume_by_merchant} />}
          />
        </Grid>
        <Grid item xs={12}>
          <AnalyticsCard 
            title="Top Donors" 
            content={<TopDonors data={analytics.donation_volume_by_top_donors} />}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default AnalyticsPage;