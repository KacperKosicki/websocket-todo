import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const App = () => {
  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);

    const handleSocketEvent = (event, callback) => socket.on(event, callback);

    handleSocketEvent('addTask', (task) => addTask(task, false));
    handleSocketEvent('removeTask', (taskId) => removeTask(taskId, false));
    handleSocketEvent('updateData', updateTasks);

    return () => socket.disconnect();
  }, []);

  const addTask = (task, emitEvent = true) => {
    setTasks((prevTasks) => [...prevTasks, task]);
    emitEvent && socket.emit('addTask', task);
  };

  const removeTask = (taskId, emitEvent = true) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    emitEvent && socket.emit('removeTask', taskId);
  };

  const updateTasks = (data) => setTasks(data);

  const handleInputChange = (e) => setTaskName(e.target.value);

  const submitForm = (e) => {
    e.preventDefault();
    if (taskName.trim() === '') return;

    const newTask = { id: Math.random().toString(36).substr(2, 9), name: taskName };
    addTask(newTask);
    setTaskName('');
  };

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task) => (
            <li key={task.id} className="task">
              {task.name}{' '}
              <button className="btn btn--red" onClick={() => removeTask(task.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>

        <form id="add-task-form" onSubmit={submitForm}>
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            value={taskName}
            onChange={handleInputChange}
          />
          <button className="btn" type="submit">
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;