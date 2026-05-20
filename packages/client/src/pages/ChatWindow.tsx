import { useState, useEffect, useRef } from 'react';
import styles from './ChatWindow.module.css';
import Greeting from '../components/Greeting/Greeting';
import InputField from '../components/InputField/InputField';
import ReactMarkdown from 'react-markdown';

function ChatWindow() {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const lastMessageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedHistory = localStorage.getItem('chat_history');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('chat_history', JSON.stringify(history));
        }
    }, [history, isInitialized]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        setHistory((oldHistory) => [...oldHistory, { role: 'user', content: inputValue }]);
        setIsLoading(true);
        setInputValue('');

        try {
            const res = await fetch('http://localhost:3006/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: inputValue,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Server error');
            }

            if (!data) {
                throw new Error("No response from server");
            }

            setHistory((oldHistory) => [...oldHistory, { role: 'assistant', content: data.response }]);

        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = error.message;
            setHistory((oldHistory) => [...oldHistory, { role: 'assistant', content: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [history]);

    return (
        <div className={styles.wrapper}>
            {history.length === 0 ? <Greeting /> : null}
            {
                history.map((message, idx) => {
                    const isLastMessage = idx === history.length - 1;
                    switch (message.role) {
                        case "user":
                            return (
                                <div className={styles.userMessage} key={idx} ref={isLastMessage ? lastMessageRef : null}>
                                    {message.content}
                                </div>
                            )
                        case "assistant":
                            return (
                                <div className={styles.assistantMessage} key={idx} ref={isLastMessage ? lastMessageRef : null}>
                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                </div>
                            )
                    }
                })
            }
            {isLoading && (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                </div>
            )}
            <InputField  handleSend={handleSend} inputValue={inputValue} setInputValue={setInputValue} isLoading={isLoading} />
        </div>
    );
}

export default ChatWindow;