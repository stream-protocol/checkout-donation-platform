import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';

import BuildIcon from '@mui/icons-material/Build';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AssessmentIcon from '@mui/icons-material/Assessment';

import DashboardPage from './dashboard-page/DashboardPage';
import ConfigPage from './config-page/ConfigPage';
import DonationsPage from './donations-page/DonationsPage';
import AnalyticsPage from './analytics-page/AnalyticsPage';
import dona from './dona.svg';

import { WalletDisconnectButton } from '@solana/wallet-adapter-material-ui'; 
import DonationType from './analytics-page/components/DonationType';

export const RecipientsContext = React.createContext();

const drawerWidth = 240;

function LoadingPage() {
  return (
    <Container>
      <Grid container spacing={3} sx={{my:2}}>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" height={320}/>
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" height={320}/>
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={1024}/>
        </Grid>
      </Grid>
    </Container>
  );
}

function MerchantPortal(props) {
  const { publicKey } = props;
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [page, setPage] = React.useState("dashboard");
  const [loading, setLoading] = React.useState(true);
  const [merchantInfo, setMerchantInfo] = React.useState();

  React.useEffect(() => {
    if (publicKey) {
      fetch(`http://127.0.0.1:5000/api/merchants/${publicKey}/dashboard`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: "include",
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.status;
        }
      })
      .then(
        (result) => {
          setMerchantInfo(result);
          setLoading(false);
        },
        (error) => {
          switch(error) {
            default:
          }
      });
    }
  }, [publicKey]);

  let pageComponent;
  let pageTitle;
  if (loading) {
    pageComponent = <LoadingPage />;
    pageTitle = "Loading data...";
  } else {
    switch(page) {
      case "dashboard":
        pageComponent = <DashboardPage merchantInfo={merchantInfo} setPage={setPage} />;
        pageTitle = "Dashboard";
        break;
      case "configs":
        pageComponent = <ConfigPage 
          configs={merchantInfo.configs} 
          publicKey={publicKey} 
          setMerchantInfo={setMerchantInfo}
        />;
        pageTitle = "Configurations";
        break;
      case "analytics":
        pageComponent = <AnalyticsPage analytics={merchantInfo.analytics} />;
        pageTitle = "Analytics";
        break;
      case "donations":
        pageComponent = <DonationsPage donations={merchantInfo.donations} />;
        pageTitle = "Donations";
        break;
      default: 
        pageComponent = <p>Invalid page.</p>;
        pageTitle = "Invalid Page";
    }
  }

  return (
    <RecipientsContext.Provider value={merchantInfo && merchantInfo.available_recipients}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        <Drawer 
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              borderRight: 0,
              bgcolor: theme.palette.grey[100]
            },
          }}
        >
          <Box sx={{ px:6, py:4 }}>
            <img width="100%" src={DonationType} alt="Donate" />
          </Box>
          <List sx={{flexGrow:1}} disablePadding>
            <ListItem 
              button 
              onClick={() => setPage("dashboard")}
              sx={{
                borderTopRightRadius:32, 
                borderBottomRightRadius: 32,
                mb: 1,
                backgroundColor: page === "dashboard" && theme.palette.grey[300],
                '&:hover': {
                  background: theme.palette.grey[300]
                },
              }}
            >
              <ListItemIcon>
                <DashboardIcon 
                  sx={{ 
                  color: page === "dashboard" ? 
                  theme.palette.secondary.main : 
                  theme.palette.grey[800] }} 
                />
              </ListItemIcon>
              <ListItemText 
                primary="Dashboard"  
                sx={{ 
                  color: page === "dashboard" && 
                  theme.palette.secondary.main }} 
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => setPage("configs")}
              sx={{
                borderTopRightRadius:32, 
                borderBottomRightRadius: 32,
                my: 1,
                backgroundColor: page === "configs" && theme.palette.grey[300],
                '&:hover': {
                  background: theme.palette.grey[300]
                },
              }}
            >
              <ListItemIcon>
                <BuildIcon 
                  sx={{ 
                    color: page === "configs" ? 
                    theme.palette.secondary.main : 
                    theme.palette.grey[800] }} 
                />
              </ListItemIcon>
              <ListItemText 
                primary="Configurations"  
                sx={{ 
                  color: page === "configs" && 
                  theme.palette.secondary.main }} 
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => setPage("analytics")}
              sx={{
                borderTopRightRadius:32, 
                borderBottomRightRadius: 32,
                my: 1,
                backgroundColor: page === "analytics" && theme.palette.grey[300],
                '&:hover': {
                  background: theme.palette.grey[300]
                },
              }}
            >
              <ListItemIcon>
                <AssessmentIcon 
                  sx={{ 
                    color: page === "analytics" ? 
                    theme.palette.secondary.main : 
                    theme.palette.grey[800] }} 
                />
              </ListItemIcon>
              <ListItemText 
                primary="Analytics"  
                sx={{ 
                  color: page === "analytics" && 
                  theme.palette.secondary.main }} 
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => setPage("donations")}
              sx={{
                borderTopRightRadius:32, 
                borderBottomRightRadius: 32,
                my: 1,
                backgroundColor: page === "donations" && theme.palette.grey[300],
                '&:hover': {
                  background: theme.palette.grey[300]
                },
              }}
            >
              <ListItemIcon>
                <PointOfSaleIcon  
                  sx={{ 
                    color: page === "donations" ? 
                    theme.palette.secondary.main : 
                    theme.palette.grey[800] }} 
                />
              </ListItemIcon>
              <ListItemText 
                primary="Donations"  
                sx={{ 
                  color: page === "donations" && 
                  theme.palette.secondary.main }} 
              />
            </ListItem>
          </List>
          <Typography variant="overline" sx={{pb:1}} align="center">MERCHANT PORTAL</Typography>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pb: 2,
            px: 2,
          }}>
            <WalletDisconnectButton fullWidth variant="outlined" color="secondary"/>
          </Box>
        </Drawer>

        <Box
          component="main"
          sx={{
            backgroundColor: theme.palette.grey[100],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          {pageComponent}
        </Box>
        
      </Box>
    </RecipientsContext.Provider>
  );
}

export default MerchantPortal;