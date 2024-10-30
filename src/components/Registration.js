import '../App.css'; //global styles
import SiteHeader from './SiteHeader';
import TextBlackBG from './TextBlackBG';

function Registration() {
    return (
    <div>
        <SiteHeader></SiteHeader>
        <TextBlackBG label="Registration Page"></TextBlackBG>
    </div>
    );
}

export default Registration; //sends function when imported