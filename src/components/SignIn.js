import '../App.css'; //global styles
import SiteHeader from './SiteHeader';
import TextBlackBG from './TextBlackBG';

function SignIn() {
    return (
    <div>
        <SiteHeader></SiteHeader>
        <TextBlackBG label="Sign In Page"></TextBlackBG>
    </div>
    );
}

export default SignIn; //sends function when imported