import '../App.css'; //global styles
import SiteHeader from './SiteHeader';
import TextBlackBG from './TextBlackBG';

function AdminDashboard() {
    return (
    <div>
        <SiteHeader></SiteHeader>
        <TextBlackBG label="Admin Dashboard"></TextBlackBG>
    </div>
    );
}

export default AdminDashboard; //sends function when imported