import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import apiClient from "../api/apiClient";
import '../css/ProjectDetails.css'

function ProjectDetails() {
    const {projectId} = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await apiClient.get(`/projects/${projectId}/`);
                setProject(response.data);
            } catch (error) {
                console.error("Error fetching project details:", error);
            }
        }
        fetchProjectDetails();
    },[projectId])
    
    if (!project) {
        return <div>Ten projekt nie istnieje</div>;
    }

    return (
    <div className='project-details-container'> 
        <div className='project-details-box'>
            <h1 className='project-detail-title'>{project.title}</h1>
            <div className='project-details-content'>
                <div className='project-details-members'>
                    <h3>Członkowie</h3>
                </div>
                <div className='project-details-description'> 
                    {project.description}
                </div>
            
                <div className='project-details-chat'>
                    <h3>Chat</h3>
                </div>  

            </div>
        </div>
    </div>
)
};

export default ProjectDetails;