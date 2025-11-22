import ProjectList from '../components/ProjectList.jsx'
import '../css/home.css'

function Home(){
    return (
    <div>
        <div className='project-list-container'>
            <div className='project-list-box'>
                <ProjectList />
            </div>             
        </div> 
    </div>);

}

export default Home;