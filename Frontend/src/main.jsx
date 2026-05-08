// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import TodoApp from './TodoApp'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TodoApp username="YourName" />
  </React.StrictMode>
)
