import {useState, useEffect} from 'react'
import apiClient from '../api/apiClient';

function ProjectList() {
    const [projectList,setProjectList] = useState([])
    const [error, setError] = useState('')

    const handleProjectClick = (e) => {
        alert('Klik');
    }

    useEffect(() => {
        const fetchProjects = async () => {
            try{
                const response = await apiClient.get('projects/');

                setProjectList(response.data);
                setError('');
            }
            catch(err){
                console.error('Błąd pobierania projektów');
                setError(err.message || "Wystąpił błąd serwera");
            }
        };
        fetchProjects(); 
    
    }, []);

    return(
    <div>
        <h1>Lista projektów</h1>
        {projectList.length== 0 ? ("Brak projektów") : 
            (
            projectList.map((project, index) => (
                <div className='project-list-box-item' key = {project.id || index}>
                    <h3 onClick={() => handleProjectClick(project.id)} className='project-title'>
                        {project.title}
                    </h3>
                    <p className='project-description'>
                        {project.description}
                    </p> 
                    
                </div>    
                ))
            ) 
        }
    </div>);
}

export default ProjectList;