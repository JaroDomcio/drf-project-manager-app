import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import apiClient from "../api/apiClient";
import '../css/ProjectDetails.css'
import Modal from '../components/Modal.jsx'

function ProjectDetails() {
    const {projectId} = useParams();
    const [project, setProject] = useState(null);
    const [members,setMembers] = useState(null);

    const [isMyTasksOpen, setMyTasksOpen] = useState(false);
    const [isStatisticsOpen, setStatisticsOpen] = useState(false)

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const ProjectResponse = await apiClient.get(`/projects/${projectId}/`);
                const MembersResponse = await apiClient.get(`/projects/${projectId}/members`)

                setProject(ProjectResponse.data);
                setMembers(MembersResponse.data)
            } catch (error) {
                console.error("Error fetching project details:", error);
            }
        }
        fetchProjectDetails();
    },[projectId])
    
    if (!project) {
        return <div>Ten projekt nie istnieje</div>;
    }

    // const handleTasks = () => {
    //     alert('Task click')
    // }

    // const handleStats = () => {
    //     alert('stats click')
    // }


    return (
    <div className='project-details-container'>
        <div className="project-details-options-container">
            <p className="project-details-option" onClick = { () => setMyTasksOpen(true)} >Moje zadania</p>
            <p className="project-details-option" onClick = { () => setStatisticsOpen(true)} >Statystyki</p>
            {/* <p className="project-details-option" onClick = { () => handleAddTask()} >Dodaj zadanie</p>
            <p className="project-details-option" onClick = { () => handleAddMember()} >Dodaj członka</p> */}
        </div>
        <div className='project-details-box'>
            <h1 className='project-detail-title'>{project.title}</h1>
            <div className='project-details-content'>
                <div>
                    <div className='project-details-members'>
                        <h3>Członkowie</h3>
                        {members.length === 0 ? ("Brak członków"): 
                            (
                                members.map((member) => (
                                    <div key={member.id} className="member-list">
                                        <p className='member-list-name'>{member.first_name} {member.last_name}</p>
                                    </div>
                                )
                                )
                            )
                        }
                    </div>

                </div>
                <div className='project-details-description'> 
                    <h3>Opis projektu</h3>
                    {project.description}
                </div>
            
                <div className='project-details-chat'>
                    <h3>Chat</h3>
                </div>  

            </div>
        </div>
    <Modal isOpen ={isMyTasksOpen} onClose={() => setMyTasksOpen(false)}>
        
    </Modal>

    <Modal isOpen ={isStatisticsOpen} onClose={() => setStatisticsOpen(false)}>
        
    </Modal>
    </div>
)
};

export default ProjectDetails;