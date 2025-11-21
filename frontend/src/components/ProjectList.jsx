import {useState, useEffect} from 'react'

function ProjectList() {
    const [projectList,setProjectList] = useState([])
    const [error, setError] = useState('')


    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/projects/', {
                    method: "GET",
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setProjectList(data);
                } else {
                    const errorText = 'Błąd serwera';
                    console.error(errorText);
                    setError(errorText);
                }
            } catch (err) {
                console.error('Błąd pobierania');
                setError('Wystąpił błąd sieci lub serwer jest niedostępny.');
            }
        };
        fetchProjects(); 
    
    }, []);

    return(
    <div>
        <h1>Lista projektów</h1>
        {projectList.map((project, index) => (
            <li key = {projectList.id || id}>
                {projectList.title}
            </li>
        )
        )}
    </div>);
}

export default ProjectList;