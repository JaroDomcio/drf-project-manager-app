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

    const handleTaskClick = (id) => {
        alert('Clicked task');
    }

    return (
        <div className='task-list-box'> 
            <h1>Twoje zadania</h1>
            <div>
                {taskList.length === 0 ? ("No tasks available") : ( 
                    taskList.map((task, index) => (
                        <div key={task.id || index} className = 'task-list-item'>
                            {task.status === 'TO_DO' ? ( <div className='task-todo'>Do zrobienia</div> ) : 
                            (task.status === 'IN_PROGRESS' ? ( <div className='task-inprogress'>W trakcie</div> ) : 
                            ( <div className='task-done'>Zakończone</div>)
                            )}
                            <h3 onClick = { () => handleTaskClick(task.id)} className='task-title'>{task.title}</h3>
                            <p className='task-description'>{task.description}</p>
                            {task.deadline === null ? (<div className = "task-deadline"> Brak deadlinu </div>) : (
                               <p className='task-deadline'> Deadline: {task.deadline}</p> 
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default TaskList;