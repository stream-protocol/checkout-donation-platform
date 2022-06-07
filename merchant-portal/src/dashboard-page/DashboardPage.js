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
    <Card>
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

function DashboardPage(props) {
  const { merchantInfo, setPage } = props;

  const activeConfigPresent = merchantInfo.configs.active_config;
  
  return (
    <Container>
      <Grid container spacing={3} sx={{my:2}}>
        <Grid item xs={12} md={activeConfigPresent ? 6 : 12}>
          <DashboardCard 
            title="Donation Volume By Day"
            content={<VolumeByDay data={merchantInfo.analytics.donation_volume_daily.slice(-7)} />}
            setPage={setPage}
            page="analytics"
            pageText="See all analytics"
          />
        </Grid>
        {activeConfigPresent &&
          <Grid item xs={12} md={6}>
            <DashboardCard 
              title="Active Configuration" 
              content={<ActiveConfig config={merchantInfo.configs.active_config} />}
              setPage={setPage}
              page="configs"
              pageText="See all configurations"
            />
          </Grid>
        }
        <Grid item xs={12}>
          <DashboardCard 
            title="Latest Donations" 
            content={<DonationsTable donations={merchantInfo.donations.slice(0, 10)} />}
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