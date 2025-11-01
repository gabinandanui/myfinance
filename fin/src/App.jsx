import { useState, useCallback } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PopupBtn from './components/PopupBtn'
import ExpenseDisplay from './components/ExpenseDisplay'

function App() {
  const [expense, setExpense] = useState([]);
  const [editExpense, SetEditExpense] = useState([]);
  const refreshData = useCallback(() => {
    fetch('http://localhost:4000/api/expenses')
      .then(res => res.json())
      .then(data => setExpense(data));
  }, [setExpense]);
  return (
    <>
      <PopupBtn key={expense.id} expense={expense} setExpense={setExpense} editExpense={editExpense} SetEditExpense={SetEditExpense}/>
      <ExpenseDisplay key={expense.id} expense={expense} setExpense={setExpense} editExpense={editExpense} SetEditExpense={SetEditExpense} refreshData={refreshData}/>
    </>
  )
}

export default App
