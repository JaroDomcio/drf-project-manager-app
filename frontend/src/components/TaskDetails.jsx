import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import '/src/css/taskDetails.css';

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
      
      <div className="task-info-section">
        <h2>{task.title}</h2>
        
        <div style={{margin: '20px 0'}}>
            <p><strong>Opis:</strong></p>
            <p>{task.description}</p>
        </div>

        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Termin:</strong> {task.deadline || "Brak"}</p>
      </div>

      <div className="task-comments-section">
        <h3>Komentarze</h3>

      <textarea 
          placeholder="Dodaj komentarz..." 
          className="task-comment-input"
      />
      
      <button className="task-comment-submit-btn">
          Wyślij
</button>
      </div>

    </div>
  );
}

export default TaskDetails;
