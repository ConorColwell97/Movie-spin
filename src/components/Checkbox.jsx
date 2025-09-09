import { useState } from "react";
import '../pages/styles.css';

const Checkbox = ({visible, addItems, item, setArr}) => {
    const [checked, setChecked] = useState(false);

    const handleChange = (e) => {
        const val = e.target.checked;
        setChecked(val);
        addItems(setArr, item, val);
    }

    return (
        <input 
            className={visible ? '' : 'not-visible'} 
            type="checkbox"
            checked={checked} 
            onChange={handleChange}
            style={{accentColor: "#088F8F"}}
        />
    );
}

export default Checkbox;