import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import '/src/css/taskDetails.css';


function TaskDetails({ taskId }) {
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);


  useEffect(() => {
    if (!taskId) return;

    const fetchTaskDetails = async () => {
      try {
        const response = await apiClient.get(`/tasks/${taskId}/`);
        setTask(response.data);
        
        const commentsResponse = await apiClient.get(`/comments/?task=${taskId}`);
        setComments(commentsResponse.data.results);

      } catch (error) {
        console.error('Error fetching task details:', error);
      }
    };
    fetchTaskDetails();
  }, [taskId]);

  const getAuthorName = (id) => {
    const user = comments.find(comment => comment.id === id);
  }

  if (!task) return <div>Ładowanie...</div>;

return (
    <div className="task-details-container">
      
      <div className="task-info-section">
        <h2>{task.title}</h2>
        
        <div>
            <p><strong>Opis:</strong></p>
            <p>{task.description}</p>
        </div>

        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Deadline:</strong> {task.deadline || "Brak"}</p>
      </div>

      <div className="task-comments-section">
        <h3>Komentarze</h3>
        {comments.length === 0 ? (
          <p>Brak komentarzy</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="task-comment">
              <p><strong>{comment.author_name}</strong> ({new Date(comment.created_at).toLocaleString()}):</p>
              <p>{comment.content}</p>
            </div>
          ))
        )}

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
