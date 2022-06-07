import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import { WalletDialogProvider, WalletMultiButton } from '@solana/wallet-adapter-material-ui'; 
// TODO: make material
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import React, { FC, ReactNode, useMemo } from 'react';
import MerchantPortal from './MerchantPortal';
import dona from './dona.svg';

import { styled, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

require('@solana/wallet-adapter-react-ui/styles.css');

const App: FC = () => {
  return (
    <Context>
      <Content />
    </Context>
  );
};
export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Content: FC = () => {
  const { publicKey } = useWallet();
  const theme = useTheme();
  return (
    <div>
      {
        publicKey ? 
        <MerchantPortal publicKey={publicKey} /> :
        <Box sx={{background:"linear-gradient(30deg, rgba(91,0,181,1) 14%, rgba(157,0,172,1) 27%, rgba(153,13,201,1) 53%, rgba(74,0,124,1) 81%, rgba(0,0,0,1) 100%)"}}>
          <Container maxWidth="sm" sx={{background: theme.palette.common.white, height:"100vh"}}>
            <Stack spacing={4} sx={{px: 16, height: "100vh"}} justifyContent="center">
              <Box sx={{ px:6}}>
                <img width="100%" src={dona} alt="Dona" />
              </Box>
              <Typography align="center" variant="h4">Merchant Portal</Typography>
              <Typography align="center" variant="h6">Sign in with your Solana Wallet</Typography>
              <WalletMultiButton/>
            </Stack>
          </Container>
        </Box>
      }
    </div>
  );
};
