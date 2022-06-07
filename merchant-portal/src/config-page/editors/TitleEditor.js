import * as React from 'react';

import TextField from '@mui/material/TextField';

function TitleEditor(props) {
  const { config, setConfig } = props;
  const [title, setTitle] = React.useState(config.name);
  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  React.useEffect(() => {
    setConfig(
      (prevConfig) => {
        return {
          ...prevConfig,
          name: title,
        };
      }
    );
  }, [title]);

  return (
    <TextField
      label="Title"
      value={title}
      onChange={handleChange}
    />
  );
}

export default TitleEditor;