import * as React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { styled, useTheme } from '@mui/material/styles';
import { centsToDollars } from '../../utils';

function VolumeByDay(props) {
  const { data } = props;
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <Line type="monotone" dot={false} dataKey="value" stroke={theme.palette.primary.main} strokeWidth={2}/>
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(value) => {return "$" + centsToDollars(value)}} />
        <Tooltip formatter={(value) => {return "$" + centsToDollars(value)}} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default VolumeByDay;