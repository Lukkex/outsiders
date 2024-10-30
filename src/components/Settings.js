import '../App.css'; //global styles
import SiteHeader from './SiteHeader';
import TextBlackBG from './TextBlackBG';

function Settings() {
    return (
    <div>
        <SiteHeader></SiteHeader>
        <TextBlackBG label="Settings Page"></TextBlackBG>
    </div>
    );
}

export default Settings; //sends function when imported