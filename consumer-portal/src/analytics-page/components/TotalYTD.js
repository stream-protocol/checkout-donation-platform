import * as React from 'react';
import Typography from '@mui/material/Typography';

import { centsToDollars } from '../../utils';

function TotalYTD(props) {
  const { data } = props;

  return (
    <div>
      <Typography variant="h2">${centsToDollars(data)}</Typography>
    </div>
  );
}

export default TotalYTD;