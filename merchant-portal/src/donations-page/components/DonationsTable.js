import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';

import { centsToDollars } from '../../utils';

function DonationsTable(props) {
  const { donations } = props;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Donation Amount</TableCell>
            <TableCell>Recipient</TableCell>
            <TableCell>Donation Type</TableCell>
            <TableCell>Reference</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {donations.map((donation, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {'$' + centsToDollars(donation.donation_amount)}
              </TableCell>
              <TableCell>{donation.recipient_name}</TableCell>
              <TableCell>{donation.donation_type}</TableCell>
              <TableCell>
                <Link href={donation.solscan_url}>
                  {donation.reference}
                </Link>
              </TableCell>
              <TableCell>{donation.date_time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DonationsTable;