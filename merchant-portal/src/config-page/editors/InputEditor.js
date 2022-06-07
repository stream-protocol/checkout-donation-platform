import * as React from 'react';

import Stack from '@mui/material/Stack';
import RecipientSelector from './RecipientSelector';
import InputField from './InputField';

function InputEditor(props) {
  const { config, setConfig } = props;
  const [inputAmount, setInputAmount] = React.useState(config.options[0].donation_cents);

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
      <InputField inputAmount={inputAmount} setInputAmount={setInputAmount} label="Default Amount"/>
      <RecipientSelector config={config} setConfig={setConfig}/>
    </Stack>
  );
}

export default InputEditor;