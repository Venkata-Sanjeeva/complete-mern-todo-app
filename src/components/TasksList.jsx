import React, { useState, useEffect } from 'react';
import axios from "axios";

export default function TasksList() {
  const [tasksList, setTasksList] = useState([]); // Initialize state to hold tasks
  const [loading, setLoading] = useState(true); // State to track loading status
  const [editing, setEditing] = useState(false); // State to track isTaskEditing status
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalCompletedTasks, setTotalCompletedTasks] = useState(0);


  useEffect(() => {
    axios.get("https://todo-app-server-auu3.onrender.com/alltasks")
      .then(response => {
        const tasksWithEditingFlag = response.data.map(task => ({
          ...task,
          isEditing: false
        }));

        const completedTasks = response.data.filter(task => task.isCompleted);

        setTasksList(tasksWithEditingFlag); // Set the fetched data to state
        setLoading(false); // Stop the loading state
        setTotalTasks(tasksWithEditingFlag.length);
        setTotalCompletedTasks(completedTasks.length);

      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false); // Stop the loading state even on error
      });
  }, []); // Empty dependency array means this useEffect runs once when the component mounts

  function changingTaskEditingValue(taskId) {
    setEditing(true);

    const tasksWithEditingFlag = tasksList.map(task => {
      if (task._id === taskId) {
        // If this is the task to be edited, toggle the isEditing flag to true
        return { ...task, isEditing: true };
      }
      // Otherwise, return the task as is
      return { ...task, isEditing: false };
   
  });
    setTasksList(tasksWithEditingFlag);

  }

  function taskEditing(taskId) {
    const editedTitle = document.querySelector(".editingInput").value;
    
    axios.put(`https://todo-app-server-auu3.onrender.com/update/${taskId}`, { title: editedTitle })
      .then(response => {
        setEditing(false);
        window.location.href = response.data.redirect; 
      })
      .catch(err => console.log(err));
  }
  
  function taskCompleted(taskId) {
    axios.put(`https://todo-app-server-auu3.onrender.com/update/task/${taskId}`, { isCompleted: true })
      .then(response => {
        window.location.href = response.data.redirect; 
      })
      .catch(err => console.log(err));
  }
  
  function deleteFunction(taskId) {
    const endPoint = `https://todo-app-server-auu3.onrender.com/task/delete/${taskId}`;
    
    axios.delete(endPoint)
      .then(response => {
        window.location.href = response.data.redirect; 
      })
      .catch(err => console.log(err));
  }
  


  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    
    <div className='tasks-list'>
      <div className='task-counting-div'>
        <p className='total-tasks-heading'>Total Tasks: <span className='total-tasks-value'>{totalTasks}</span></p>
        <p className='total-completed-tasks-heading'>Completed Tasks: <span className='total-completed-tasks-value'>{totalCompletedTasks}</span></p>
      </div>
      {tasksList.length > 0 ? (
        <ul className='task-container'>
          {tasksList.map((task) => {
            if(task.isEditing) {
              // console.log("from editing if block");
              
              return <li key={task._id} data-task-id={task._id} id={`${task._id}`}>
                  <input type="text" placeholder='Edit Your Task...' name='title' className='editingInput'/>
                  <button onClick={() => taskEditing(task._id)}>Save</button>
                  <button onClick={() => deleteFunction(task._id)}>Delete</button>
                </li>
            } else {
              return task.isCompleted ? 
              <li key={task._id} data-task-id={task._id} className="task-li" id={`${task._id}`}>
                <p className="completed-task">{task.title}</p>
                <button onClick={() => deleteFunction(task._id)}>Delete</button>
              </li>
            : 
              <li key={task._id} data-task-id={task._id} className={`task-li`} id={`${task._id}`}>
                <p>{task.title}</p>
                <button onClick={() => changingTaskEditingValue(task._id)}>Edit</button>
                <button onClick={() => taskCompleted(task._id)}>Mark as Completed</button>
                <button onClick={() => deleteFunction(task._id)}>Delete</button>
              </li>
            }
          })}
        </ul>
      ) : (
        <p>No Tasks Found!</p>
      )}
    </div>
  );
}