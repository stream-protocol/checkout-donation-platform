import * as React from 'react';
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip } from 'recharts';

function DonationType(props) {
  const { data } = props;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart width={730} height={250}>
        <Pie data={data} dataKey="value" nameKey="type" cx="50%" cy="50%" innerRadius={50} outerRadius={80} fill="#82ca9d" label />
        <Legend verticalAlign="top" height={36}/>
        <Tooltip/>
      </PieChart>
    </ResponsiveContainer>
  );
}

export default DonationType;