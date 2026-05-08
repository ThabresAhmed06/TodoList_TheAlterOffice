import React, { useState, useEffect } from "react";
import Auth from "./Auth.jsx";
import TodoInput from "./TodoInput.jsx";
import TodoList from "./TodoList.jsx";
import './TodoApp.css';

function TodoApp() {
  const [user, setUser] = useState(() => localStorage.getItem('current_user'));
  const [lists, setLists] = useState([{ id: 'default', name: 'Loading...', tasks: [] }]);
  const [activeListId, setActiveListId] = useState('default');
  const API_URL = "http://localhost:5000/api";
  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/lists/${user}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setLists(data);
            setActiveListId(data[0].id);
          } else {
            setLists([{ id: 'default', name: 'My Tasks', tasks: [] }]);
          }
        })
        .catch(err => console.error("Data fetch failed:", err));
    }
  }, [user]);
  useEffect(() => {
    if (user && lists[0].name !== 'Loading...') {
      fetch(`${API_URL}/lists/${user}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lists })
      }).catch(err => console.error("Sync failed:", err));
    }
  }, [lists, user]);
  const addNewList = () => {
    const name = prompt("Name your new list:");
    if (!name || !name.trim()) return;
    const newList = { 
      id: Date.now().toString(), 
      name: name.trim(), 
      tasks: [] 
    };
    setLists(prev => [...prev, newList]);
    setActiveListId(newList.id);
  };
  const handleEditListName = (listId) => {
    const listToEdit = lists.find(l => l.id === listId);
    const newName = prompt("Rename this list:", listToEdit.name);
    if (!newName || !newName.trim() || newName === listToEdit.name) return;
    setLists(prev => prev.map(list => 
      list.id === listId ? { ...list, name: newName.trim() } : list
    ));
  };
  const addTask = (text) => {
    setLists(prev => prev.map(list => {
      if (list.id === activeListId) {
        return { ...list, tasks: [...list.tasks, { id: Date.now(), text, completed: false }] };
      }
      return list;
    }));
  };

  const toggleTask = (taskId) => {
    setLists(prev => prev.map(list => {
      if (list.id === activeListId) {
        return {
          ...list,
          tasks: list.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }
      return list;
    }));
  };
  const deleteTask = (taskId) => {
    setLists(prev => prev.map(list => {
      if (list.id === activeListId) {
        return { ...list, tasks: list.tasks.filter(t => t.id !== taskId) };
      }
      return list;
    }));
  };
  const clearCompleted = () => {
    setLists(prev => prev.map(list => {
      if (list.id === activeListId) {
        return { ...list, tasks: list.tasks.filter(t => !t.completed) };
      }
      return list;
    }));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
  };
  if (!user) return <Auth onLogin={setUser} />;
  const activeList = lists.find(l => l.id === activeListId) || lists[0];
  return (
    <div className="todo-app">
      {/* SIDEBAR */}
      <aside className="header">
        <div className="user-profile">
          <h2 className="user-name">Welcome, {user}</h2>
        </div>
        <nav className="sidebar-nav">
          <p className="sidebar-label">MY LISTS</p>
          <ul className="list-items">
            {lists.map(list => (
              <li 
                key={list.id} 
                className={list.id === activeListId ? "list-link active" : "list-link"}
                onClick={() => setActiveListId(list.id)}
              >
                <span className="list-title">{list.name}</span>
                <span className="badge">{list.tasks.length}</span>
              </li>
            ))}
            <button className="btn-add-list" onClick={addNewList}>
              + Create New List
            </button>
          </ul>
        </nav>
        
        <button className="btn-logout" onClick={logout}>Log Out</button>
      </aside>
      <main className="main-content">
        <div className="content-container">
          <header className="list-header">
            <div className="active-list-title-group">
              <h1 className="main-title">{activeList.name}</h1>
              <button 
                className="edit-list-title-btn" 
                onClick={() => handleEditListName(activeList.id)}
              >
                ✎
              </button>
            </div>
            
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
