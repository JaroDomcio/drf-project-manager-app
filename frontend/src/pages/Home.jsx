import ProjectList from '../components/ProjectList.jsx'
import TaskList from '../components/TaskList.jsx';
import '../css/home.css'

function Home(){
    return (
    <div className='home-page'>
        <div className='project-list-container'>
            <ProjectList />       
        </div> 
        <div className='task-container'>
            <TaskList />
        </div>
    </div>);

}

export default Home;