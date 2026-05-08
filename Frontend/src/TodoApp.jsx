import React, { useState, useEffect } from "react";
import Auth from "./Auth.jsx";
import TodoInput from "./TodoInput.jsx";
import TodoList from "./TodoList.jsx";
import './TodoApp.css';

function TodoApp() {
  const [user, setUser] = useState(() => localStorage.getItem('current_user'));
  
  // State for multiple lists
  const [lists, setLists] = useState(() => {
    const saved = localStorage.getItem(`lists_${user}`);
    return saved ? JSON.parse(saved) : [{ id: 'default', name: 'Groceries', tasks: [] }];
  });
  
  // Track active list
  const [activeListId, setActiveListId] = useState('default');

  // Helper to get the current list object
  const activeList = lists.find(l => l.id === activeListId) || lists[0];

  // Save to local storage whenever lists or user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`lists_${user}`, JSON.stringify(lists));
    }
  }, [lists, user]);

  const addNewList = () => {
    const name = prompt("Enter list name:");
    if (!name || !name.trim()) return;
    
    const newList = { id: Date.now().toString(), name: name.trim(), tasks: [] };
    setLists(prev => [...prev, newList]);
    setActiveListId(newList.id);
  };

  const addTask = (text) => {
    setLists(prevLists => prevLists.map(list => {
      if (list.id === activeListId) {
        return { 
          ...list, 
          tasks: [...list.tasks, { id: Date.now(), text, completed: false }] 
        };
      }
      return list;
    }));
  };

  const toggleTask = (taskId) => {
    setLists(prevLists => prevLists.map(list => {
      if (list.id === activeListId) {
        return {
          ...list,
          tasks: list.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return list;
    }));
  };

  const deleteTask = (taskId) => {
    setLists(prevLists => prevLists.map(list => {
      if (list.id === activeListId) {
        return {
          ...list,
          tasks: list.tasks.filter(task => task.id !== taskId)
        };
      }
      return list;
    }));
  };

  const clearCompleted = () => {
    setLists(prevLists => prevLists.map(list => {
      if (list.id === activeListId) {
        return {
          ...list,
          tasks: list.tasks.filter(task => !task.completed)
        };
      }
      return list;
    }));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
  };

  // If not logged in, show Auth component
  if (!user) return <Auth onLogin={(u) => setUser(u)} />;

  return (
    <div className="todo-app">
      {/* Sidebar Section */}
      <aside className="header">
        <div className="user-info-professional">
          <h2 className="user-display-name">Welcome Back, {user}</h2>
        </div>

        <nav className="sidebar-section">
          <p className="section-label">MY LISTS</p>
          <ul className="list-nav">
            {lists.map(list => (
              <li 
                key={list.id} 
                className={list.id === activeListId ? "active-list-item" : "list-item"}
                onClick={() => setActiveListId(list.id)}
              >
                <span>{list.name}</span>
                <span className="task-count">{list.tasks.length}</span>
              </li>
            ))}
            <li className="add-list-btn" onClick={addNewList}>
              + New List
            </li>
          </ul>
        </nav>
        
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </aside>

      {/* Main Content Section */}
      <main className="main-content">
        <div className="content-wrapper">
          <header className="list-header">
            <h1 className="active-list-title">{activeList.name}</h1>
            <TodoInput onAddTask={addTask} />
          </header>
          
          <TodoList 
            tasks={activeList.tasks} 
            onToggle={toggleTask} 
            onDelete={deleteTask} 
            onClear={clearCompleted}
          />
        </div>
      </main>
    </div>
  );
}

export default TodoApp;
