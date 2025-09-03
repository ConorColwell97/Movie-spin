import { useState } from "react";
import '../pages/styles.css';

const Checkbox = ({visible, addGenreFilter, genre}) => {
    const [checked, setChecked] = useState(false);

    const handleChange = (e) => {
        const val = e.target.checked;
        setChecked(val);
        addGenreFilter(genre, val);
    }

    return (
        <input 
            className={visible ? '' : 'not-visible'} 
            type="checkbox"
            checked={checked} 
            onChange={handleChange}
        />
    );
}

export default Checkbox;