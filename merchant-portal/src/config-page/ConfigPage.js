import * as React from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import ConfigCard from './ConfigCard';
import NewConfigButton from './NewConfigButton';

function ConfigPage(props) {
  const { configs, publicKey, setMerchantInfo } = props;
  const [merchantConfigs, setMerchantConfigs] = React.useState(configs);

  React.useEffect(() => {
    setMerchantInfo(
      (prevMerchantInfo) => {
        return {
          ...prevMerchantInfo,
          configs: merchantConfigs,
        }
      }
    );
    fetch(`http://127.0.0.1:5000/api/merchants/${publicKey}/donation-configs`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify({
        donation_configs: merchantConfigs,
      })
    });
  }, [merchantConfigs]);

  return (
    <Container maxWidth="sm">
      <Stack spacing={4} sx={{mt:4, mb:4}}>
        {
          merchantConfigs && 
          merchantConfigs.active_config &&
            <ConfigCard 
              initialConfig={merchantConfigs.active_config} 
              isActive={true}
              setMerchantConfigs={setMerchantConfigs}
            />
        }
        {
          merchantConfigs && 
          merchantConfigs.inactive_configs && 
          merchantConfigs.inactive_configs.map((config, index) => (
            <ConfigCard 
              key={index} 
              index={index} 
              initialConfig={config} 
              isActive={false} 
              setMerchantConfigs={setMerchantConfigs}
            />
          ))
        }
        <NewConfigButton setMerchantConfigs={setMerchantConfigs}/>
      </Stack>
    </Container>
  );
}

export default ConfigPage;