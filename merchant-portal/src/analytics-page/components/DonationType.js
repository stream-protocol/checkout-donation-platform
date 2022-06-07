import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { centsToDollars } from '../../utils';

function DonationType(props) {
  const { data } = props;
  const theme = useTheme();
  const COLORS = [theme.palette.warning.main, theme.palette.success.main, theme.palette.info.main, theme.palette.success.main];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart width={730} height={250}>
        <Pie 
          data={data} 
          dataKey="value" 
          nameKey="type" 
          cx="50%" 
          cy="50%" 
          innerRadius={50} 
          outerRadius={80} 
          fill="#82ca9d" 
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            value,
            index
          }) => {return "$" + centsToDollars(value)}}
        > 
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="top" height={36}/>
        <Tooltip formatter={(value) => {return "$" + centsToDollars(value)}}/>
      </PieChart>
    </ResponsiveContainer>
  );
}

export default DonationType;