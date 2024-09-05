import React, { useState } from 'react';
import TasksList from './TasksList';

export default function Body() {
  const [title, setTitle] = useState(""); // Managing the title state

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the form's default submission behavior

    try {
      // Send a POST request to the server using fetch
      const response = await fetch("https://todo-app-server-auu3.onrender.com/upload/task", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title })  // Send the task title in the body
      });

      const data = await response.json();  // Parse the JSON response

      if (data.redirect) {
        // If the server responds with a redirect URL, navigate to that page
        window.location.href = data.redirect;
      }
    } catch (error) {
      console.error("Error submitting task:", error);  // Log any errors
    }
  };

  return (
    <div className='body'>
      <form onSubmit={handleSubmit}>
        <label>Enter Your Task Here:</label>
        <input
          type="text"
          placeholder="Name of your task"
          id="task-name"
          name="title"
          required
          value={title}  // Bind the title state to the input
          onChange={(e) => setTitle(e.target.value)}  // Update title state on input change
        />
        <button type="submit">Submit</button>  
        {/* // Trigger the form submission handler */}
      </form>
      <TasksList />  
      {/* // Display the list of tasks */}
    </div>
  );
}
