import { useState } from "react";
import '../pages/styles.css';

const Checkbox = ({visible, action, item, setArr}) => {
    const [checked, setChecked] = useState(false);

    const handleChange = (e) => {
        const val = e.target.checked;
        setChecked(val);
        action(setArr, item, val);
    }

    return (
        <input 
            className={visible ? '' : 'not-visible'} 
            type="checkbox"
            checked={checked} 
            onChange={handleChange}
            style={{accentColor: "#470000" }}
        />
    );
}

export default Checkbox;