import styles from './Greeting.module.css'
import chatIcon from '../../assets/icon-chat.png';

export default function Greeting () {

    return (
        <div>
            <div className={styles.icon}>
                <img className={styles.iconImage} src={chatIcon} alt="Chat" />
            </div>
            <div className={styles.greeting}>
                <h2>Hi there!</h2>
                <h1>What would you like to know?</h1>
                <p>Use one of the most common prompts below<br/>or ask your own question</p>
            </div>
        </div>
    )
}