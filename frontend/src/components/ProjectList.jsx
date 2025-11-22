import {useState, useEffect} from 'react'
import apiClient from '../api/apiClient';

function ProjectList() {
    const [projectList,setProjectList] = useState([])
    const [error, setError] = useState('')


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
                <p key = {project.id || index}>
                    {project.title}
                </p>))
            ) 
        }
    </div>);
}

export default ProjectList;