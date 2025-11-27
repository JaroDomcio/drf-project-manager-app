import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import apiClient from "../api/apiClient";


function ProjectDetails() {
    const {projectId} = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await apiClient.get(`/projects/${projectId}`);
                setProject(response.data);
            } catch (error) {
                console.error("Error fetching project details:", error);
            }
            fetchProjectDetails
        }
    },[projectId])
    
    if (!project) {
        return <div>Ten projekt nie istnieje</div>;
    }

    return (
    <div className="project-details-cointainer"> 
        
    </div>
)
};

export default ProjectDetails;