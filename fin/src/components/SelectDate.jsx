import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
const SelectDate = ({ value, onChange, error }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Select Date"
        format="DD/MM/YYYY"
        className='w-full'
        defaultValue={dayjs()}
        value={value}
        onChange={onChange}
        slotProps={{
          textField: {
            id: 'my-datepicker-input', // Assign ID to the TextField
            name: 'myDateInput', // Optional: assign a name attribute
            error,
            helperText: error ? "Date is required" : "",
            sx: {
              '& .MuiInputBase-root': {
                color: '#1976d2',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#115293',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0d47a1',
              },
              '& .MuiInputLabel-root': {
                color: '#1976d2',
              },
              '& .MuiFormHelperText-root': {
                color: error ? '#d32f2f' : '#1976d2',
              },
            },
          },
        }}
      />

    </LocalizationProvider>
  );
};

export default SelectDate;
