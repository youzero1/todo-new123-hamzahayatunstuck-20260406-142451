'use client';

import { useState, useCallback } from 'react';

type FilterType = 'all' | 'active' | 'completed';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Buy groceries', completed: false, createdAt: Date.now() - 3000 },
    { id: '2', text: 'Read a book', completed: true, createdAt: Date.now() - 2000 },
    { id: '3', text: 'Go for a walk', completed: false, createdAt: Date.now() - 1000 }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const addTodo = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now()
    };
    setTodos(prev => [newTodo, ...prev]);
    setInputValue('');
  }, [inputValue]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') addTodo();
    },
    [addTodo]
  );

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="container">
      <h1 className="title">✅ Todo App</h1>
      <p className="subtitle">Stay organized and get things done</p>

      <div className="input-row">
        <input
          className="input"
          type="text"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="New todo input"
        />
        <button className="btn-add" onClick={addTodo} aria-label="Add todo">
          + Add
        </button>
      </div>

      <div className="filters">
        {(['all', 'active', 'completed'] as FilterType[]).map(f => (
          <button
            key={f}
            className={`filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <ul className="todo-list">
        {filteredTodos.length === 0 ? (
          <li className="empty-state">
            {filter === 'completed'
              ? 'No completed tasks yet'
              : filter === 'active'
              ? 'No active tasks — great job!'
              : 'No tasks yet. Add one above!'}
          </li>
        ) : (
          filteredTodos.map(todo => (
            <li key={todo.id} className={`todo-item${todo.completed ? ' completed' : ''}`}>
              <div
                className={`checkbox${todo.completed ? ' checked' : ''}`}
                onClick={() => toggleTodo(todo.id)}
                role="checkbox"
                aria-checked={todo.completed}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && toggleTodo(todo.id)}
              >
                {todo.completed && <span className="checkbox-icon">✓</span>}
              </div>
              <span className={`todo-text${todo.completed ? ' completed' : ''}`}>
                {todo.text}
              </span>
              <button
                className="btn-delete"
                onClick={() => deleteTodo(todo.id)}
                aria-label={`Delete "${todo.text}"`}
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>

      <div className="footer">
        <span>
          {activeCount} item{activeCount !== 1 ? 's' : ''} left
        </span>
        {completedCount > 0 && (
          <button className="btn-clear" onClick={clearCompleted}>
            Clear completed ({completedCount})
          </button>
        )}
      </div>
    </div>
  );
}
