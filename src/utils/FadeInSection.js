import React from 'react';
import ReactDOM from 'react-dom';

function FadeInSection(props) {
    const { duration = 1000 } = props; // default is 1000ms
    const [isVisible, setVisible] = React.useState(false);
    const domRef = React.useRef();

    React.useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => setVisible(entry.isIntersecting));
        });

        if (domRef.current) {
            observer.observe(domRef.current);
        }

        return () => {
            if (domRef.current) {
                observer.unobserve(domRef.current);
            }
        };
    }, []);

    return (
        <div
        className = {`transition-opacity ease-in-out opacity-0 ${isVisible ? 'opacity-100' : ''}`}
        style = {{transitionDuration: `${duration}ms`}} 
        ref = {domRef}>
            {props.children}
        </div>
  );
}
   
export default FadeInSection;
   