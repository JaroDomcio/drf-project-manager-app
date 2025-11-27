import {useState, useEffect} from 'react'
import apiClient from '../api/apiClient';

function TaskList() {
    const [taskList,setTaskList] = useState([])
    const [error, setError] = useState('')

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchTasks = async () => {
            try{
                const response = await apiClient.get(`tasks/?page=${page}`);
                setTaskList(response.data.results);

                const totalPages = Math.ceil(response.data.count / 3); 
                setTotalPages(totalPages);
                
                setError('');
            }
            catch(err){
                console.error('Error fetching tasks');
                setError(err.message || "Server error occurred");
            }
        };
        fetchTasks(); 
    }, [page]);

    const handleChangeToNextPage = () => {
        if (page < totalPages){
            setPage(page + 1);
        }
    }

    const handleChangeToPreviousPage = () => {
        if (page > 1){
            setPage(page - 1);
        }
    }

    const handleTaskClick = (id) => {
        alert('Clicked task');
    }

    return (
        <div className='task-list-box'> 
            <h1>Twoje zadania</h1>
            <div>
                {taskList.length === 0 ? ("No tasks available") : ( 
                    taskList.map((task) => (
                        <div key={task.id} className = 'task-list-item'>
                            {task.status === 'TO_DO' ? ( <div className='task-todo'>Do zrobienia</div> ) : 
                            (task.status === 'IN_PROGRESS' ? ( <div className='task-inprogress'>W trakcie</div> ) : 
                            (
                            <div className='task-done'>Zakończone</div>
                        )
                            )}
                            <h3 onClick = { () => handleTaskClick(task.id)} className='task-title'>
                                {task.title}
                            </h3>
                            <p className='task-description'>
                                {task.description}
                            </p>
                            {task.deadline === null ? (<div className = "task-deadline"> Brak deadlinu </div>) : 
                            (
                               <p className='task-deadline'> Deadline: {task.deadline}</p> 
                            )}
                        </div>
                    ))
                )} 
            </div>
            {totalPages > 1 ? (
                <div className='pagination-buttons'>
                    <button onClick={handleChangeToPreviousPage} disabled={page === 1}>
                        Poprzednia
                    </button>
                
                    <span> Strona {page} z {totalPages} </span>
                
                    <button onClick={handleChangeToNextPage} disabled={page === totalPages}>
                        Następna
                    </button>
                </div>
            ) : (null)}
        </div>
    );
}

export default TaskList;