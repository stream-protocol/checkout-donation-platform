import * as React from 'react';

import Stack from '@mui/material/Stack';
import RecipientSelector from './RecipientSelector';
import InputField from './InputField';

function FixedEditor(props) {
  const { config, setConfig } = props;
  const [inputAmount, setInputAmount] = React.useState(config.options[0].donation_cents);

  // TODO: unify with InputEditor for cleanliness
  // TODO: unify with InputDefaultField in MultiType and MultiRecipient editors

  React.useEffect(() => {
    setConfig(
      (prevConfig) => {
        return {
          ...prevConfig,
          options: [
            {
              ...prevConfig.options[0],
              donation_cents: inputAmount,
              transaction_cents: prevConfig.options[0].purchase_cents + inputAmount,
            }
          ]
        };
      }
    );
  }, [inputAmount]);

  return (
    <Stack spacing={2}>
      <InputField inputAmount={inputAmount} setInputAmount={setInputAmount} label="Amount"/>
      <RecipientSelector config={config} setConfig={setConfig}/>
    </Stack>
  );
}

export default FixedEditor;