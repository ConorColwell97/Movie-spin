import '../pages/styles.css';
import Checkbox from './Checkbox';
import { motion } from 'framer-motion';

const Card = ({ visible, action, item, setArr, text, context }) => {
    return (
        <motion.div className='container' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <p style={{ color: "#470000" }}><b>Title:</b> {item.title}</p>
            <p style={{ color: "#470000" }}><b>Released:</b> {item.releaseDate}</p>
            <p style={{ color: "#470000" }}><b>Overview:</b> {item.overview}</p>
            <label style={{ color: "#470000", fontWeight: "bold" }}>
                {text}
                {context === 'store' ? (
                    <Checkbox visible={visible} action={action} item={item} setArr={setArr} />
                ) : (
                    <Checkbox visible={visible} action={action} item={item.title} setArr={setArr} />
                )}
            </label>
        </motion.div>
    );
}

export default Card;