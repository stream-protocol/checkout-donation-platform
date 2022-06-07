import * as React from 'react';

import RecipientSelector from './RecipientSelector';

function RoundUpEditor(props) {
  const { config, setConfig } = props;

  return (
    <RecipientSelector config={config} setConfig={setConfig}/>
  );
}

export default RoundUpEditor;