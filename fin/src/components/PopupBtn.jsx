import React, { useEffect, useState } from 'react'
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
const PopupBtn = ({expense, setExpense, editExpense, SetEditExpense }) => {
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
  // Default should be null or an option object, not a string
  const [expenseCategory, setExpenseCategory] = useState(null);
  const [paymentCategory, setPaymentCategory] = useState(null);
  const [amount, setAmount] = useState(null);
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
    setExpenseCategory(null);
    setPaymentCategory(null);
    setAmount(null);
    setDate(dayjs());
  };
  // Handle form submit for add/update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const expenseData = {
      ...form,
      id: editExpense && editExpense.id ? editExpense.id : Date.now().toString(),
      date: form.date ? dayjs(form.date).format("DD/MM/YYYY") : "",
    };

      if (editExpense && editExpense.id) {
      // Update
      const res = await fetch(`https://humble-train-x55v4w66x656c6x6p-4000.app.github.dev/api/expenses/${expenseData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });
      if (res.ok) {
        const text = await res.text();
        if (text) {
          const updated = JSON.parse(text);
          setExpense((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
          );
        }
        SetEditExpense({});
        handleClose && handleClose();
      }
    } else {
      // Add
      const apiUrl = "https://humble-train-x55v4w66x656c6x6p-4000.app.github.dev";
      const res = await fetch(`${apiUrl}/api/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });
      const saved = await res.json();
      setExpense((prev) => [...prev, saved]);
    }
    handleClose && handleClose();
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
        <DialogTitle>Add Your Expenses Data here</DialogTitle>
        <DialogContent className="w-full">
          <DialogContentText>
            Add Following details to keep the financial info organized
          </DialogContentText>
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
              <TextField className="w-full" id="my-expense-amount" value={form.expenseAmount} name="expenseAmount" type="number" label='Amount' required onChange={handleChange}/>
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
              defaultValue=""
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
          { editExpense['id'] && editExpense['id'].length >0 ? '' : <Button onClick={handleClose}>Cancel</Button>}
          <Button type="submit" form="subscription-form">
            {editExpense['id'] && editExpense['id'].length >0 ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};


export default PopupBtn