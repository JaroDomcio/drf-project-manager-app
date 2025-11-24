import {useState, useEffect} from 'react'
import apiClient from '../api/apiClient';

function TaskList() {
    const [taskList,setTaskList] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchTasks = async () => {
            try{
                const response = await apiClient.get('tasks/');
                setTaskList(response.data.results);
                setError('');
            }
            catch(err){
                console.error('Error fetching tasks');
                setError(err.message || "Server error occurred");
            }
        };
        fetchTasks(); 
    }, []);

    return (
        <div className='task-list-box'> 
            <h1>Twoje zadania</h1>
            <div>
                {taskList.length === 0 ? ("No tasks available") : ( 
                    taskList.map((task, index) => (
                        <div key={task.id || index} className = 'task-list-item'>
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default TaskList;