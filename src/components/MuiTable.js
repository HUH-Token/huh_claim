import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';

function createData(name, type, lang, runtime, genre) {
  return { name, type, lang, runtime, genre };
}

const useStyles = makeStyles({
  genre: {
    background: 'rgba(0, 255, 0, 0.5)',
    border: 'transparent',
    borderRadius: 20,
    textAlign: 'center',
    display: 'inline-block',
    padding: '3px 15px',
    margin: 5
  }
});

export default function DenseTable(props) {
  const classes = useStyles();
  const {selectedLockInfo} = props;
  if (props.selectedLockInfo === null)
    return(
      <>
      &nbsp;
      </>
    )
  const classifyLockId = (startEmission, endEmission) => {
    console.log(startEmission)
    console.log(endEmission)
    // eslint-disable-next-line eqeqeq
    if (startEmission == 1638741535 && endEmission == 1646006400)
      return ['Presale']
    // eslint-disable-next-line eqeqeq
    if (startEmission == 1646006400 && endEmission == 1656374400)
      return ['Dev Wallet']
    return []
  }
  const rows = [
    createData(
      selectedLockInfo.sharesDeposited/1E9,
      (selectedLockInfo.sharesWithdrawn/selectedLockInfo.sharesDeposited*100).toFixed(2),
      (new Date(selectedLockInfo.startEmission*1000)).toLocaleString(),
      (new Date(selectedLockInfo.endEmission*1000)).toLocaleString(),
      classifyLockId(selectedLockInfo.startEmission, selectedLockInfo.endEmission)
    )
  ];
  return (
    <div >
    <span className="inner-contain span">LockID Details</span>
    <TableContainer component={Paper} sx={{ maxHeight: 450 }}>
      <Table sx={{ minWidth: 550 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow >
            <TableCell align="center">Total HUH</TableCell>
            <TableCell align="center">HUH Withdrawn %</TableCell>
            <TableCell align="center">Vesting Start</TableCell>
            <TableCell align="center">Vesting End</TableCell>
            <TableCell align="center">Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="center">{row.type}</TableCell>
              <TableCell align="center">{row.lang}</TableCell>
              <TableCell align="center">{row.runtime}</TableCell>
              <TableCell align="center">
                {row.genre.map((item, index) => {
                  return (
                    <div className={classes.genre} key={index}>{item}</div>
                  )
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}
