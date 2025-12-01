import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

function TaskDetails({ taskId }) {
  const [task, setTask] = useState(null);

  useEffect(() => {
    if (!taskId) return;

    const fetchTaskDetails = async () => {
      try {
        const response = await apiClient.get(`/tasks/${taskId}/`);
        setTask(response.data);
      } catch (error) {
        console.error('Error fetching task details:', error);
      }
    };
    fetchTaskDetails();
  }, [taskId]);

  if (!task) return <div>Ładowanie...</div>;

  return (
    <div className="task-details-container">
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Termin: {task.deadline}</p>
    </div>
  );
}

export default TaskDetails;
