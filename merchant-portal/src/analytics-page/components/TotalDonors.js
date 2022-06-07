import * as React from 'react';
import Typography from '@mui/material/Typography';

function TotalDonors(props) {
  const { data } = props;

  return (
    <div>
       <Typography variant="h2">{data}</Typography>
    </div>
  );
}

export default TotalDonors;