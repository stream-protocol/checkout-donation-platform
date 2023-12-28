import * as React from 'react';
import * as utils from './donation-component/utils';
import DonationComponent from "./donation-component/DonationComponent";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import JSONPretty from 'react-json-pretty';

export const dummyDonationConfigs = [
  {
    id: 0,
    name: "Round up to the nearest dollar",
    type: "single",
    options: [
      {
        type: "roundup",
        donation_cents: 14,
        purchase_cents: 286,
        transaction_cents: 300,
        recipient: {
          id: 0,
          name: "UNICEF",
          wallet: "loremipsumdolorsitamet",
          description: 'lorem ipsum dolor sit amet',
        }
      },
    ],
  },
  {
    id: 1,
    name: "Donate a fixed amount",
    type: "single",
    options: [
      {
        type: "fixed",
        donation_cents: 100,
        purchase_cents: 286,
        transaction_cents: 386,
        recipient: {
          id: 0,
          name: "UNICEF",
          wallet: "loremipsumdolorsitamet",
          description: 'lorem ipsum dolor sit amet',
        }
      },
    ],
  },
  {
    id: 2,
    name: "Customer enters donation amount",
    type: "single",
    options: [
      {
        type: "input",
        donation_cents: 100,
        purchase_cents: 286,
        transaction_cents: 386,
        recipient: {
          id: 0,
          name: "UNICEF",
          wallet: "loremipsumdolorsitamet",
          description: 'lorem ipsum dolor sit amet',
        }
      },
    ],
  },
  {
    id: 3,
    name: "Multiple donation types",
    type: "multi_type",
    options: [
      {
        type: "fixed",
        donation_cents: 100,
        purchase_cents: 286,
        transaction_cents: 386,
        recipient: {
          id: 0,
          name: "UNICEF",
          wallet: "loremipsumdolorsitamet",
          description: 'lorem ipsum dolor sit amet',
        }
      },
      {
        type: "fixed",
        donation_cents: 300,
        purchase_cents: 286,
        transaction_cents: 586,
        recipient: {
          id: 0,
          name: "UNICEF",
          wallet: "loremipsumdolorsitamet",
          description: 'lorem ipsum dolor sit amet',
        }
      },
      {
        type: "fixed",
        donation_cents: 500,
        purchase_cents: 286,
        transaction_cents: 786,
        recipient: {
          id: 0,
          name: "UNICEF",
          wallet: "loremipsumdolorsitamet",
          description: 'lorem ipsum dolor sit amet',
        }
      },
      {
        type: "input",
        donation_cents: 100,
        purchase_cents: 286,
        transaction_cents: 386,
        recipient: {
          id: 0,
          name: "UNICEF",
          wallet: "loremipsumdolorsitamet",
          description: 'lorem ipsum dolor sit amet',
        }
      },
    ],
  },
  {
    id: 4,
    name: "Multiple donation recipients",
    type: "multi_recipient",
    options: [
      {
        type: "roundup",
        donation_cents: 14,
        purchase_cents: 286,
        transaction_cents: 300,
        recipient: {
          id: 0,
          name: "UNICEF",
          wallet: "loremipsumdolorsitamet",
          description: 'lorem ipsum dolor sit amet',
        }
      },
      {
        type: "roundup",
        donation_cents: 14,
        purchase_cents: 286,
        transaction_cents: 300,
        recipient: {
          id: 1,
          name: "American Red Cross",
          wallet: "loremipsumdolorsitamet",
          description: 'lorem ipsum dolor sit amet',
        }
      },
      {
        type: "roundup",
        donation_cents: 14,
        purchase_cents: 286,
        transaction_cents: 300,
        recipient: {
          id: 2,
          name: "Charity: Water",
          wallet: "loremipsumdolorsitamet",
          description: 'lorem ipsum dolor sit amet',
        }
      },
    ],
  },
  {
    id: 5,
    name: "Complex custom configurations",
    type: "custom",
    options: [
      {
        type: "fixed",
        donation_cents: 100,
        purchase_cents: 286,
        transaction_cents: 386,
        recipient: {
          id: 0,
          name: "UNICEF",
          wallet: "loremipsumdolorsitamet",
          description: 'lorem ipsum dolor sit amet',
        }
      },
      {
        type: "input",
        donation_cents: 500,
        purchase_cents: 286,
        transaction_cents: 786,
        recipient: {
          id: 1,
          name: "American Red Cross",
          wallet: "loremipsumdolorsitamet",
          description: 'lorem ipsum dolor sit amet',
        }
      },
      {
        type: "roundup",
        donation_cents: 14,
        purchase_cents: 286,
        transaction_cents: 300,
        recipient: {
          id: 2,
          name: "Charity: Water",
          wallet: "loremipsumdolorsitamet",
          description: 'lorem ipsum dolor sit amet',
        }
      },
    ],
  },
];

function DemoComponent(props) {
  const { config } = props;
  const [selectedOption, setSelectedOption] = React.useState();
  let donationDollars, recipientName;
  if (selectedOption) {
    donationDollars = utils.centsToDollars(selectedOption.donation_cents);
    recipientName = selectedOption.recipient.name;
  }

  return ( 
    <Stack spacing={1}>
      <Typography variant="h6">{config.name}</Typography>
      <Box sx={{bgcolor:"#e9ebea", pt:4, pb:4, borderRadius: 2}}>
        <Container maxWidth="xs">
          <Paper sx={{p:2}}>
            <DonationComponent configOverride={config} setSelectedOption={setSelectedOption}/>
          </Paper>
        </Container>
      </Box>
      {
        selectedOption &&
        <div>
        <Alert severity="info">Selected donation option: ${donationDollars} to {recipientName}</Alert>
        <JSONPretty id="json-pretty" data={selectedOption}></JSONPretty>
        </div>
      }
    </Stack>
  );
}

function Demo() {
  const [selectedOption, setSelectedOption] = React.useState();
	return (
		<Container maxWidth="sm" sx={{mt:2, mb:2}}>
      <Typography variant="h4" align="center">Donation Components Demo</Typography>
      <Stack 
        spacing={2} 
        sx={{pt:2, pb:2}}
        divider={<Divider />}
      >
        <DonationComponent 
          merchantPublicKey="35pQAYGCE95rnzJvYFtxGhpnDpMoZKzk6f5DxJhGszE9"
          purchaseCents={86}
          setSelectedOption={setSelectedOption}
        />
        <JSONPretty id="json-pretty" data={selectedOption}></JSONPretty>
      	{dummyDonationConfigs.map((config, index) => (
          <DemoComponent key={index} config={config}/>
				))}
      </Stack>
    </Container>
	);
}

export default Demo;