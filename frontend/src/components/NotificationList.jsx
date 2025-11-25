import {useEffect, useState} from 'react';
import apiClient from '../api/apiClient';


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
            <h1>Brak powiadomień</h1>
            ) : 
            (
                notifications.map((notification, index) => (
                <div className='notifications-list-box-item' key = {notification.id || index}>
                    <h3 className='notification-body'>
                        {notification.message}
                    </h3>
                </div>    
                ))
            )}
    </div>
    );
}

export default NotificationList;