![Stream Protocol Donate Logo](stream-protocol-donate-logo.svg)

Stream Donate is a checkout donations platform built on Solana Pay
- [Presentation Link](https://docs.google.com/presentation/d/1jOvFfoGpHa9zBjC2quTEGFc7hLyspL3vVwWp19CYApw/edit?usp=sharing)
- [Video Demo](https://www.youtube.com/watch?v=uzxK5JNRXHM)

### Project Description
StreamPay "Donate" is a checkout donations platform built on Solana Pay. Using StreamPay, merchants can set up a checkout donation campaign that smoothly integrates into their existing Solana Pay checkout flow to enable charitable donations. With flexible integration options, plug-and-play React components, no-code configuration settings, and analytics, we make it easy for merchants to showcase their values, support their community, and do good for the world.

### Why we built it
Traditional checkout donation systems (e.g. round-up-and-donate at the grocery store) generate over $605 M annually in charitable giving. However, by running on traditional payment rails, traditional checkout donations suffer from issues such as high merchant processing fees, slow settlement of time-sensitive funds, limited transparency on donation delivery, and limited accessibility. With the new Solana Pay rails, we see an opportunity to reimagine and improve the checkout donations experience for merchants, consumers, and donation recipients alike.

### The Donation Platform
The Donation platform consists of the following components:
- `donations-api`:  API endpoints used to integrate StreamPay donate into a Solana Pay checkout flow
- `donations-component`: ready-to-use React component that uses Stream Protocol´s Donations API
- `merchant-portal`: web app for merchants to configure the donation options presented at checkout and to access metadata and analytics
- `recipient-portal`: web app for donation recipients to access metadata and analytics
- `consumer-portal`: web app for consumers to access metadata and analytics
- `server`: backend logic for the API and the merchant, recipient, and consumer portals
- `checkout-demo`: mock e-commerce checkout page to showcase the Donations Component

## Integrating Donation Platform Into A Checkout Flow
Stream Protocol´s Donations API and Donations Component are used to present customers with an option to donate in the checkout flow for a e-commerce store or a point-of-sale kiosk using Solana Pay.
### Quick Start
Install the Donations API and the Donations Component.
```
npm config set '@stream-donate:registry' https://node.bit.dev
npm i stream-donate-api @stream-donate/react-components.ui.donation-component
```
Render the Donation Component in the checkout flow by passing in the merchant's public key and the purchase subtotal (pre-donation) in cents as props.
```javascript
import  *  as  React  from  'react';
import  DonationComponent  from  '@stream-donate/react-components.ui.donation-component';

function Example(props) {
	const { merchantPublicKey, purchaseCents } = props;
	const [selectedOption, setSelectedOption] = React.useState();
	return (
		<DonationComponent 
			merchantPublicKey={merchantPublicKey}
			purchaseCents={purchaseCents}
			setSelectedOption={setSelectedOption}
		/>
	);
}
```
After the customer selects a donation using the Donation Component, `selectedOption` contains information that supports two use cases of Solana Pay:
- Customer pays the donation recipient separately using Solana Pay's [Transfer Request Specification](https://github.com/solana-labs/solana-pay/blob/link-request/SPEC.md#specification-transfer-request) 
- Customer pays both the merchant and the donation recipient with a single payment using Solana Pay's [Transaction Request Specification](https://github.com/solana-labs/solana-pay/blob/link-request/SPEC.md#specification-transaction-request) 

Use either of these to present the donation to the customer. See Solana Pay's [Merchant Integration](https://docs.solanapay.com/core/merchant-integration) for an example.

*Note: As of 3/17/22, **Transaction Requests have not been officially released by Solana Pay**, so Transaction Requests have been implemented using the unmerged pull request code.*
```javascript
// pay the donation recipient separately
selectedOption.donation_transfer_request.url

// split a single payment between merchant and donation recipient
selectedOption.donation_transaction_request.url
```
After the customer completes the transaction, mark the donation complete using the merchant's public key and the `selectedOption` set by the Donation Component.
```javascript
import { markDonationComplete } from  'stream-donate-api';

const onTransactionVerified = (merchantPublicKey, selectedOption) => {
	markDonationComplete(merchantPublicKey, selectedOption);
}
```
### Donation Options
A Donation Option contains information about a specific donation a customer could perform. It consists of the following fields:
- `type`: the type of Donation Option, which is one of the following values:
	- `roundup`: the donation round the purchase up to the nearest dollar
	- `fixed`: the donation is a fixed amount
	- `input`: the donation amount is entered by the customer using an input field 
- `recipient`: an object representing the recipient of the donation, which consists of the following fields:
	- `public_key`: the public key of the recipient's wallet
	- `name`: the name of the recipient
	- `description`: a description of the recipient
- `donation_cents`: the amount of the donation in cents, if the type of the Donation Option is `input` the value represents the default amount of the donation in cents
- `purchase_cents`: the amount of pre-donation subtotal
- `transaction_cents`: the amount of the total purchase including the donation
- `donation_transfer_request`: an object containing information necessary to implement Solana Pay's [Transfer Request Specification](https://github.com/solana-labs/solana-pay/blob/link-request/SPEC.md#specification-transfer-request), consisting of the following fields (which may be overridden if the developer so chooses):
	- `recipient`: the public key of the recipient's wallet
	- `amount`: the amount of the transfer in units of the SPL token (Note that this is **only the donation amount**, not the total amount inclusive of the donation amount)
	- `spl_token`: the address of the SPL token used for the transfer
	- `reference`: randomly generated public key that can be used as a unique identifier for the transaction
	- `label`: URL-encoded UTF-8 string of the form 'Confirm donation to (recipient name)'
	- `message`: URL-encoded UTF-8 string of the form 'Donation of (amount) USDC to (recipient name)'
	- `url`: A Solana Pay transfer request URL combining the information in the previous fields. If no overrides are needed for the previous fields, a developer can use this URL directly as a link to pay the donation recipient.

- `donation_transaction_request`: an object containing information necessary to implement Solana Pay's [Transaction Request Specification](https://github.com/solana-labs/solana-pay/blob/link-request/SPEC.md#specification-transaction-request), consisting of the following fields (which may be overridden if the developer so chooses):
	- `link`: URL for the wallet to POST to in order to access the serialized Solana transaction which splits the payment between merchant and donation recipient respectively
	- `label`: URL-encoded UTF-8 string of the form 'Confirm purchase including donation to (recipient name)
	- `message`: URL-encoded UTF-8 string of the form 'Your purchase includes a (donation amount) donation to (recipient name)'
	- `url`: A Solana Pay transaction request URL combining the information in the previous fields. If no overrides are needed for the previous fields, a developer can use this URL directly as a link to pay both the merchant and the donation recipient with a single payment.

*Note: As of 3/17/22, **Transaction Requests have not been officially released by Solana Pay**, so Transaction Requests have been implemented using the unmerged pull request code.*

### Donation Configurations
A Donation Configuration contains information about the options to donate presented to the customer at checkout. It consists of the following fields:
- `name`: the name of the configuration as assigned by the merchant
- `type`: the type of Donation Configuration, which is one of the following values:
	- `single`: the Donation Configuration contains a single Donation Option
	- `multi_type`: the Donation Configuration contains multiple Donation Options that all have the same recipient but are all different types
	- `multi-recipient`: the Donation Configuration contains multiple Donation Options that all different recipients but are the same type
	- `custom`: the Donation Configuration contains multiple Donation Options with potentially different recipients and different types
- `options`: a list of Donation Options

### Donations API Specification
#### `getDonationConfig`
- Purpose
	- fetch the merchant's active configuration
- Inputs
	- `merchantPublicKey`: the public key of the merchant's wallet used to log in to the merchant portal
	- `purchaseCents`: the amount of the purchase subtotal (pre-donation) in cents
- Output
	- `active_config` the active Donation Configuration for the merchant, null if inputs are invalid
#### `markDonationComplete`
- Purpose
	- mark a donation complete after the customer completes the transaction, to allow for accurate analytics and metadata
- Inputs
	- `merchantPublicKey`: the public key of the merchant's wallet used to log in to the merchant portal
	- `selectedOption`: the Donation Option used for the donation
	- `merchantTransactionId`: (optional) a unique identifier to label this donation
	- `consumerPublicKey`: (optional) the public key of the customer's wallet
- Output
	- None

### Donations Component Specification
The Donations Component is a React component that displays the options to donate to the customer. The Donations Component fetches and renders the merchant's Donation Configuration based on the public key and purchase amount provided. Usage of the Donations Component is optional and typically makes calling `getDonationConfig` unnecessary. The component is implemented with [Material UI](https://mui.com/) and can be [themed accordingly](https://mui.com/customization/theming/). 

Props
- `merchantPublicKey`: the public key of the merchant's wallet used to log in to the merchant portal
- `purchaseCents`: the amount of the purchase subtotal (pre-donation) in cents
- `setSelectedOption`: the `setState` function of a [React state hook](https://reactjs.org/docs/hooks-state.html), which will be called with the correct Donation Option when the customer selects a non-zero donation
- `configOverride`: (optional) a Donation Configuration to render. When present, `merchantPublicKey` and `purchaseCents` are ignored. 

## Local Setup Instructions
Dona consists of a React app frontend, Flask App backend, and PostgreSQL database. Follow the instructions below in order to demo Dona's functionality on a local machine.

### PostgreSQL Setup
Set up a local [PostgreSQL db](https://www.codementor.io/@engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb).

Once PostgreSQL is installed, create the database for the application within postgresql: `CREATE DATABASE dona;`

### Flask App Setup
1. Navigate to the `/server` directory
2. Install virtualenv: `pip install virtualenv`
3. Create virtualenv: `virtualenv venv`
4. Activate virtualenv: `source venv/bin/activate`
5. Install dependencies: `pip install -r requirements.txt`
6. Set environment variables e.g. `export SECRET_KEY=foo && export DATABASE_URI=postgresql://user:password@localhost:5432/dona && export FLASK_ENV=development && export APP_BASE_URL=http://127.0.0.1:5000`
7. Apply database migrations: `flask db upgrade`
8. Set an env variable with the public key of a wallet (e.g. Phantom) you want to log into the merchant dashboard with e.g. `export MERCHANT_DEMO_KEY=6sXT9zFDFgJMmXPHMiZM8maSx6KFosVbLkC4Ho9GezHz`. Make sure that **you have access to this wallet**, otherwise wallet adapter will not work when you try to log in.
9. Generate some dummy demo data to populate the dashboard: `python generate_sample_data.py`
10. Run app: `flask run`

### React App Setup
The Donations API and Donations Component can be used with just the PostgreSQL and Flask App server running. 

To demo the merchant, recipient, or consumer portals, or the checkout demo, use the following steps:
1. Navigate to the directory of the React App (e.g. `cd merchant-portal`
2. Run `npm install`
3. Run `npm start`

For the Checkout Demo, to load the active configuration of a merchant account, add the environment variable `REACT_APP_MERCHANT_PUBLIC_KEY` containing the value of the merchant wallet's public key.
```
REACT_APP_MERCHANT_PUBLIC_KEY=23g35VCLME1k7HjybhqRdXX5LFZVdoxwv9HwfVNjh3uE npm start
```
