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

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('pl-PL', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const markNotificationAsRead = async (id) => {
        const notification = notifications.find((n) => n.id === id);

        if (notification.is_read){
            return; 
        }        

        setNotifications((prevNotifications) => 
            prevNotifications.map((notification) => 
                notification.id === id 
                ? {...notification, is_read: true} 
                : notification
            )
        );

        try {
            await apiClient.patch(`notifications/${id}/`, {is_read: true});
        } catch (error) {
            console.error('Error updating notification status', error);
        }
    };


return (
    <div className='notification-list-box'> 
        <h1>Lista powiadomień</h1>
        {notifications.length === 0 ? (
            <p>Brak powiadomień</p> 
            ) : 
            (
                notifications.map((notification) => (
                <div className='notification-list-box-item' key={notification.id} onMouseEnter = {() => markNotificationAsRead(notification.id)}>
                    
                    <div className="notification-content">
                        <h3 className='notification-body'>
                            {notification.message}
                        </h3>
                        <p className='notification-date'>
                            {formatDate(notification.created_at)}
                        </p>

                    </div>
                    <div 
                        className={`status-dot ${notification.is_read ? 'status-dot-read' : 'status-dot-unread'}`}
                    />
                    
                </div>    
                ))
            )}

    </div>
    );
}


export default NotificationList;