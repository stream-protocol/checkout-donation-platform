import * as React from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import ActiveConfig from './components/ActiveConfig';
import VolumeByDay from '../analytics-page/components/VolumeByDay';
import DonationsTable from '../donations-page/components/DonationsTable';

function DashboardCard(props) {
  const { title, content, setPage, page, pageText, height } = props

  return (
    <Card  variant="outlined">
      <CardContent sx={{height: height}}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        {content}
      </CardContent>
      <CardActions>
        <Button onClick={() => setPage(page)}size="small">{pageText}</Button>
      </CardActions>
    </Card>
  );
}

const analytics = {
  "total_donation_amount": 87,
  "total_donors": 1,
  "donation_volume_by_recipient": [
    {
      "recipient_name": "Aid for Ukraine",
      "value": 87
    }
  ],
  "donation_volume_by_type": [
    {
      "type": "roundup",
      "value": 87
    }
  ],
  "donation_volume_daily": [
    {
      "date": "Mon, 28 Feb 2022 00:00:00 GMT",
      "value": 87
    },
    {
      "date": "Mon, 28 Feb 2022 00:00:00 GMT",
      "value": 96
    },
    {
      "date": "Mon, 28 Feb 2022 00:00:00 GMT",
      "value": 38
    },
    {
      "date": "Mon, 28 Feb 2022 00:00:00 GMT",
      "value": 104
    }
  ]
};

const donations = [
  {
    "donation_amount": 87, 
    "merchant_name": "El Pollo Loco", 
    "donation_type": "roundup", 
    "reference": "Hf8gQHSV972JsKfgfbZP2fVWrCgXUhRPJnkRag9GUWjr", 
    "solscan_url": "https://solscan.io/tx/Hf8gQHSV972JsKfgfbZP2fVWrCgXUhRPJnkRag9GUWjr", 
    "date_time": "Feb 28, 2022 4:33 PM"
  }, 
  {
    "donation_amount": 169, 
    "merchant_name": "El Pollo Loco", 
    "donation_type": "input", 
    "reference": "abcd", 
    "solscan_url": "https://solscan.io/tx/abcd", 
    "date_time": "Feb 28, 2021 4:33 PM"
  }
];

// TODO: switch with real stuff

function DashboardPage(props) {
  const { recipientInfo, setPage } = props;
  
  return (
    <Container>
      <Grid container spacing={3} sx={{my:2}}>
        <Grid item xs={12}>
          <DashboardCard 
            title="Donation Volume By Day"
            content={<VolumeByDay data={analytics.donation_volume_daily} />}
            setPage={setPage}
            page="analytics"
            pageText="See all analytics"
          />
        </Grid>
        <Grid item xs={12}>
          <DashboardCard 
            title="Latest Donations" 
            content={<DonationsTable donations={donations} />}
            setPage={setPage}
            page="donations"
            pageText="See all donations"
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardPage;