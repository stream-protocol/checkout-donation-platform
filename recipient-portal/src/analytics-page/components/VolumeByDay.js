import * as React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

function VolumeByDay(props) {
    const { data } = props;

    return ( <
        ResponsiveContainer width = "100%"
        height = { 280 } >
        <
        LineChart data = { data } >
        <
        Line type = "monotone"
        dataKey = "value"
        stroke = "#008ae6" / >
        <
        CartesianGrid stroke = "#ccc" / >
        <
        XAxis dataKey = "date" / >
        <
        YAxis label = {
            { value: 'Dollars', angle: -90, position: 'insideLeft' } }
        /> <
        Tooltip / >
        <
        /LineChart> <
        /ResponsiveContainer>
    );
}

export default VolumeByDay;