import { useState, useRef } from 'react';
import styles from './InputField.module.css'
import micIcon from '../../assets/icon-mic.png';
import arrowIcon from '../../assets/icon-arrow.png';

interface InputFieldProps {
    handleSend: () => void;
    inputValue: string;
    setInputValue: (value: string) => void;
    isLoading: boolean;
}

export default function InputField({ handleSend, inputValue, setInputValue, isLoading }: InputFieldProps) {
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMicClick = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Speech recognition is not supported in your browser');
            return;
        }

        // Если запись уже идет, останавливаем её
        if (isRecording && recognitionRef.current) {
            recognitionRef.current.stop();
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'ru-RU';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognitionRef.current = recognition;

        recognition.onstart = () => {
            setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputValue(transcript);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setIsRecording(false);
        };

        recognition.onend = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setIsRecording(false);
            recognitionRef.current = null;
        };

        recognition.start();
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.inputContainer}>
                <button 
                    className={`${styles.micButton} ${isRecording ? styles.recording : ''}`}
                    onClick={handleMicClick}
                >
                    <img className={styles.micIcon} src={micIcon} alt="Microphone" />
                </button>
                <input
                    className={styles.inputField}
                    type="text"
                    placeholder="Ask whatever you want"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (handleSend(), setInputValue(''))}
                />
                <button className={styles.sendButton} onClick={handleSend} disabled={isLoading}>
                    <img className={styles.sendIcon} src={arrowIcon} alt="Send button" />
                </button>
            </div>
        </div>
    )
}