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
import { expenseAPI } from '../services/api';

function ExpenseDisplay({ expense, setExpense, editExpense, SetEditExpense }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Use expense from props (parent state) instead of local state
  const expenses = expense || [];

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading expenses...');
      const data = await expenseAPI.getAll();
      console.log('✅ Expenses loaded:', data);
      setExpense(data); // Update parent state
      setError(null);
    } catch (err) {
      console.error('❌ Error loading expenses:', err);
      setError('Failed to load expenses. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting expense:', id);
      await expenseAPI.delete(id);
      console.log('✅ Expense deleted');
      
      // Update parent state
      setExpense(expenses.filter(e => e.id !== id && e._id !== id));
    } catch (err) {
      console.error('❌ Error deleting expense:', err);
      setError('Failed to delete expense');
    }
  };

  const handleEdit = (expenseItem) => {
    console.log('✏️ Editing expense:', expenseItem);
    SetEditExpense(expenseItem);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginate expenses
  const paginatedExpenses = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return expenses.slice(startIndex, startIndex + rowsPerPage);
  }, [expenses, page, rowsPerPage]);

  // Calculate chart data by category
  const chartData = useMemo(() => {
    const categoryTotals = {};
    
    expenses.forEach((expense) => {
      const matchedOption = expenseOptions.find(
        (e) => e.label.toLowerCase() === expense.expenseCategory.toLowerCase()
      );
      const category = matchedOption ? matchedOption.category : 'Unknown';
      
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += parseFloat(expense.expenseAmount || 0);
    });

    return Object.keys(categoryTotals).map((category, index) => ({
      id: index,
      value: categoryTotals[category],
      label: category,
    }));
  }, [expenses]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <p>Loading expenses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        color: 'red', 
        textAlign: 'center',
        backgroundColor: '#ffe0e0',
        borderRadius: '5px',
        margin: '20px'
      }}>
        <p>{error}</p>
        <button 
          onClick={loadExpenses}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className='flex flex-row gap-5'>
        <TableContainer component={Paper} className='flex flex-col tableContainer'>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Expenses</TableCell>
                <TableCell>Amount (₹)</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Payment</TableCell>
                <TableCell align="right">Comment</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedExpenses.length > 0 ? (
                paginatedExpenses.map((expenseItem) => {
                  const matchedOption = expenseOptions.find(
                    (e) => e.label.toLowerCase() === expenseItem.expenseCategory.toLowerCase()
                  );
                  const category = matchedOption ? matchedOption.category : 'Unknown';
                  
                  return (
                    <TableRow
                      key={expenseItem._id || expenseItem.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {expenseItem.expenseCategory}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        ₹{parseFloat(expenseItem.expenseAmount).toFixed(2)}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {category}
                      </TableCell>
                      <TableCell align="right">
                        {expenseItem.date}
                      </TableCell>
                      <TableCell align="right">
                        {expenseItem.paymentCategory}
                      </TableCell>
                      <TableCell align="right">
                        {expenseItem.comment || '-'}
                      </TableCell>
                      <TableCell align="right">
                        <button 
                          onClick={() => handleEdit(expenseItem)} 
                          className='btn text-white bg-blue-700'
                          style={{
                            padding: '5px 15px',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteExpense(expenseItem._id || expenseItem.id)} 
                          className='btn text-white bg-red-700'
                          style={{
                            padding: '5px 15px',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: 'pointer',
                            marginLeft: '5px'
                          }}
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No expenses found. Add your first expense!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={expenses.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </TableContainer>
        
        <div className="chartWrapper" style={{ minWidth: '250px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>
            Expenses by Category
          </h3>
          {chartData.length > 0 ? (
            <PieChart
              series={[
                {
                  data: chartData,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                },
              ]}
              width={300}
              height={250}
            />
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>
              No data to display
            </p>
          )}
          
          {/* Legend */}
          {chartData.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              {chartData.map((item) => (
                <div key={item.id} style={{ marginBottom: '5px' }}>
                  <strong>{item.label}:</strong> ₹{item.value.toFixed(2)}
                </div>
              ))}
              <div style={{ 
                marginTop: '10px', 
                paddingTop: '10px', 
                borderTop: '2px solid #333',
                fontWeight: 'bold' 
              }}>
                Total: ₹{chartData.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ExpenseDisplay;
