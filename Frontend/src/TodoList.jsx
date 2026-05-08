import React from 'react';

const TodoList = ({ tasks, onToggle, onDelete, onClear }) => {
  // If there are no tasks, don't show an empty list
  if (tasks.length === 0) {
    return (
      <div className="todo-list-empty">
        <p>Your list is empty. Time to add some tasks!</p>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      <ul className="list-items">
        {tasks.map((task) => (
          <li key={task.id} className="task-card">
            <div className="task-main">
              <input 
                type="checkbox" 
                className="task-checkbox"
                checked={task.completed} 
                onChange={() => onToggle(task.id)} 
              />
              <span className={task.completed ? "completed-text" : "task-text"}>
                {task.text}
              </span>
            </div>

            <button 
              className="delete-btn" 
              onClick={() => onDelete(task.id)}
              title="Delete task"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      
      {tasks.some(t => t.completed) && (
        <button className="clear-btn" onClick={onClear}>
          Clear Completed
        </button>
      )}
    </div>
  );
};

export default TodoList;
