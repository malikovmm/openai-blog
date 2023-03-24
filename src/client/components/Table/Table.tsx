import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import styled from 'styled-components';
import { ReactNode } from 'react';
import Card from '../Card';

const Label = styled.div`
  display: flex;
  font-size: 18px;
  gap: 5px;
  padding-top: 15px;
  padding-left: 15px;
`;
const EmptyContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 20px;
  font-weight: bold;
  color: #666;
`;

interface Props {
  rows: any[];
  columns: any[];
  title?: string | ReactNode;
  onPageChange?: (nextPage: number) => any;
  rowsTotal?: number;
  page?: number;
  limit?: number;
  setLimit?: (nextLimit: number) => any;
  rowsPerPageOptions?: number[];
  onRowClick: (row: any) => void;
}

export default function StickyHeadTable({
  rows,
  columns,
  title,
  onPageChange,
  rowsTotal,
  page = null,
  limit = null,
  setLimit,
  rowsPerPageOptions = [10, 25, 100],
  onRowClick = () => null,
}: Props) {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const handleChangePage = (event: unknown, newPage: number) => {
    if (onPageChange) onPageChange(newPage);
    else setCurrentPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (setLimit) setLimit(+event.target.value);
    else setRowsPerPage(+event.target.value);
    if (onPageChange) onPageChange(0);
    else setCurrentPage(0);
  };
  if (!rows?.length)
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <EmptyContainer>Table is empty</EmptyContainer>
      </Paper>
    );
  return (
    <Card>
      <Label>{title}</Label>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {onPageChange
              ? rows.map((row, ix) => {
                  return (
                    <TableRow
                      hover
                      onClick={() => onRowClick(row)}
                      role="checkbox"
                      tabIndex={-1}
                      key={`${page === null ? currentPage : page}${ix}${
                        limit === null ? rowsPerPage : limit
                      }`}
                      sx={{ cursor: 'pointer' }}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              : rows
                  .slice(
                    currentPage * rowsPerPage,
                    currentPage * rowsPerPage + rowsPerPage,
                  )
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={rowsTotal}
        rowsPerPage={limit === null ? rowsPerPage : limit}
        page={page === null ? currentPage : page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}
