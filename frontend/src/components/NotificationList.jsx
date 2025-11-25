import {useEffect, useState} from 'react';



function NotificationList() {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState('');


    useEffect(() => {
        const fetchNotifications = async () =>{
            try {
                const response = await apiClient.get('notifications/');
                setNotifications(response.data.results);

                setError('');
            }catch (error) {
                console.error('Błąd pobierania powiadomień', error);
            }
        };
        fetchNotifications();
    }, []);


    return (
    <div>
        <h1>Lista powiadomień</h1>
        {notifications.length === 0 ? (
            <h>Brak powiadomień</h>
            ) : 
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
            )}
    </div>
    );
}

export default NotificationList;