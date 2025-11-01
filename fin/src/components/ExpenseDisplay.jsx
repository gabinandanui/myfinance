import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { PieChart } from '@mui/x-charts/PieChart';
import { expenseOptions } from '../data';

const ExpenseDisplay = ({ expense, setExpense, editExpense, SetEditExpense, refreshData }) => {
  // useEffect(() => { //on page load get the expenses data and assign it to expense
  //   const storedExpenses = localStorage.getItem('expense');
  //   if (storedExpenses) {
  //     setExpense(JSON.parse(storedExpenses));
  //   }
  // }, []);
  useEffect(() => {
  fetch('http://localhost:4000/api/expenses')
    .then(res => res.json())
    .then(data => setExpense(data));
    if (refreshData) {
      refreshData();
    }
}, [editExpense, refreshData]);
  const [page, setPage] = useState(0); //current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // rows per page

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (dataToEdit) => {
    SetEditExpense({ ...dataToEdit });
    console.log(dataToEdit);
    if (refreshData) {
      refreshData();
    }
  };

  // // Pagination logic
  // const paginatedExpenses = useMemo(() => {
  //   const start = page * rowsPerPage;
  //   const end = start + rowsPerPage;
  //   return expense.slice(start, end);
  // }, [expense, page, rowsPerPage]);

  const chartData = useMemo(() => {
    if (!expense || expense.length === 0) return [];
    const expenseSummary = expense.reduce((acc, currentExpense) => {
      const amt = parseInt(currentExpense.expenseAmount) || 0;
      const cat = currentExpense.expenseCategory;
      acc[cat] = (acc[cat] || 0) + amt;
      return acc;
    }, {});
    return Object.entries(expenseSummary).map(([category, amount], i) => ({
      id: i,
      label: category,
      value: amount
    }));
  }, [expense]);

  // Sort expenses by date (latest first)
  const sortedExpenses = useMemo(() => {
    return [...expense].sort((a, b) => {
      // Assumes date is in DD/MM/YYYY format
      const [da, ma, ya] = a.date.split('/').map(Number);
      const [db, mb, yb] = b.date.split('/').map(Number);
      const dateA = new Date(ya, ma - 1, da);
      const dateB = new Date(yb, mb - 1, db);
      return dateB - dateA; // latest first
    });
  }, [expense]);

  // Pagination logic (use sortedExpenses instead of expense)
  const paginatedExpenses = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedExpenses.slice(start, end);
  }, [sortedExpenses, expense, page, rowsPerPage]);

  return (
    <>
    <div className='flex flex-row gap-5'>
      <TableContainer component={Paper} className='flex flex-col tableContainer'>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Expenses</TableCell>
              <TableCell>Amount (₹)</TableCell>
              <TableCell>Expenses Category</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Payment</TableCell>
              <TableCell align="right">Comment</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedExpenses.map((expenseItem) => {
              const matchedOption = expenseOptions.find(
                (e) => e.label.toLowerCase() === expenseItem.expenseCategory.toLowerCase()
              );
              const category = matchedOption ? matchedOption.category : 'Unknown';
              return (
                <TableRow
                  key={expenseItem.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{expenseItem.expenseCategory}</TableCell>
                  <TableCell component="th" scope="row">{expenseItem.expenseAmount}</TableCell>
                  <TableCell component="th" scope="row">{category}</TableCell>
                  <TableCell align="right">{expenseItem.date}</TableCell>
                  <TableCell align="right">{expenseItem.paymentCategory}</TableCell>
                  <TableCell align="right">{expenseItem.comment}</TableCell>
                  <TableCell align="right"><button onClick={() => handleEdit(expenseItem)} className='btn text-white bg-blue-700'>Edit</button></TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell component="th" scope="row"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={expense.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>
      <div className="chartWrapper">
        <PieChart
          series={[
            {
              data: chartData,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
          width={200}
          height={200}
          
        />
      </div>
    </div>
    </>
  );
};

export default ExpenseDisplay;