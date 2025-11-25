import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SelectDate from './SelectDate';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { expenseOptions, paymentMethods } from '../data';
import AutoCompleteDropdown from './AutoCompleteDropdown';
import WrapperComponent from './WrapperComponent';
import dayjs from 'dayjs';
import { TextField } from "@mui/material";
import { expenseAPI } from '../services/api';

const PopupBtn = ({ expense, setExpense, editExpense, SetEditExpense, onExpenseAdded }) => {
  const [form, setForm] = useState({
    date: "",
    expenseAmount: "",
    expenseCategory: "",
    paymentCategory: "",
    comment: "",
  });
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [dateError, setDateError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Populate form when editing
  useEffect(() => {
    if (editExpense && editExpense.id) {
      setOpen(true);
      setForm({
        date: editExpense.date || "",
        expenseAmount: editExpense.expenseAmount || "",
        expenseCategory: editExpense.expenseCategory || "",
        paymentCategory: editExpense.paymentCategory || "",
        comment: editExpense.comment || "",
      });
    } else {
      setForm({
        date: "",
        expenseAmount: "",
        expenseCategory: "",
        paymentCategory: "",
        comment: "",
      });
    }
  }, [editExpense]);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    SetEditExpense({});
    setDate(dayjs());
    setError(null);
    setForm({
      date: "",
      expenseAmount: "",
      expenseCategory: "",
      paymentCategory: "",
      comment: "",
    });
  };

  // Handle form submit for add/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare expense data
      const expenseData = {
        expenseCategory: form.expenseCategory,
        expenseAmount: parseFloat(form.expenseAmount),
        date: form.date ? dayjs(form.date).format("DD/MM/YYYY") : dayjs().format("DD/MM/YYYY"),
        paymentCategory: form.paymentCategory,
        comment: form.comment || "",
      };

      console.log('📤 Submitting expense:', expenseData);

      if (editExpense && (editExpense.id || editExpense._id)) {
        // Update existing expense
        const id = editExpense._id || editExpense.id;
        console.log('✏️ Updating expense with ID:', id);
        
        const updated = await expenseAPI.update(id, expenseData);
        
        console.log('✅ Expense updated:', updated);
        
        // Update in parent state
        setExpense((prev) =>
          prev.map((item) => 
            (item._id === id || item.id === id) ? { ...item, ...updated } : item
          )
        );
        
        SetEditExpense({});
      } else {
        // Add new expense
        console.log('➕ Adding new expense');
        
        const newExpense = await expenseAPI.create(expenseData);
        
        console.log('✅ Expense added:', newExpense);
        
        // Add to parent state
        setExpense((prev) => [...prev, newExpense]);
        
        // Call callback if provided
        if (onExpenseAdded) {
          onExpenseAdded(newExpense);
        }
      }

      handleClose();
    } catch (err) {
      console.error('❌ Error submitting expense:', err);
      setError(err.message || 'Failed to save expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='flex justify-between pb-9'>
        <h1>Expense Details</h1>
        <Button variant="outlined" onClick={handleClickOpen}>
          Add Expenses
        </Button>
      </div>
      
      <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth className="w-full">
        <DialogTitle>
          {editExpense && (editExpense.id || editExpense._id) ? 'Edit Expense' : 'Add Your Expenses Data here'}
        </DialogTitle>
        
        <DialogContent className="w-full">
          <DialogContentText>
            {editExpense && (editExpense.id || editExpense._id) 
              ? 'Update the expense details below' 
              : 'Add following details to keep the financial info organized'}
          </DialogContentText>
          
          {error && (
            <div style={{
              padding: '10px',
              backgroundColor: '#ffe0e0',
              color: 'red',
              borderRadius: '5px',
              marginTop: '10px',
              marginBottom: '10px'
            }}>
              {error}
            </div>
          )}
          
          <form className="mt-5" onSubmit={handleSubmit} id="subscription-form">
            <WrapperComponent wrapperClass="flex gap-x-5 w-full">
              <SelectDate
                value={form.date ? dayjs(form.date, "DD/MM/YYYY") : null}
                className="w-full"
                onChange={(newDate) => {
                  setForm({ ...form, date: newDate });
                  setDateError(!newDate);
                }}
                error={dateError}
              />
              
              <TextField 
                className="w-full" 
                id="my-expense-amount" 
                value={form.expenseAmount} 
                name="expenseAmount" 
                type="number" 
                label='Amount' 
                required 
                onChange={handleChange}
                inputProps={{ min: 0, step: "0.01" }}
              />
              
              <AutoCompleteDropdown
                name="expenseCategory"
                customID="my-expense-category"
                data={expenseOptions}
                labelText="Select Category of expenses"
                customValue={form.expenseCategory}
                customSetFunction={(value) => setForm({ ...form, expenseCategory: value })}
              />
              
              <AutoCompleteDropdown
                name="paymentCategory"
                customID="my-payement-category"
                data={paymentMethods}
                labelText="Select Payment Category"
                customValue={form.paymentCategory}
                customSetFunction={(value) => setForm({ ...form, paymentCategory: value })}
              />
            </WrapperComponent>

            <TextareaAutosize
              className="w-full mt-4 block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              minRows={4}
              aria-label="maximum height"
              placeholder="Add comment with details related to this transaction eg: Milk bought in this shop"
              name="comment"
              id="my-expense-comment"
              value={form.comment}
              onChange={handleChange}
            />
            
            <input
              type="hidden"
              name="my-expense-category"
              value={form.expenseCategory}
            />
            <input
              type="hidden"
              name="my-payement-category"
              value={form.paymentCategory}
            />
          </form>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" form="subscription-form" disabled={loading}>
            {loading 
              ? 'Saving...' 
              : (editExpense && (editExpense.id || editExpense._id) ? 'Update' : 'Add')
            }
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PopupBtn;
