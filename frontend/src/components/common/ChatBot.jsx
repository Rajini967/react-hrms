import React, { useState, useRef, useEffect } from 'react';
import { FaCommentAlt, FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: 'Hello! I am your HR Assistant. How can I help you today?', isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, isBot: false };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/chart-bot/api/chat/', {
                message: userMessage.text,
                session_id: sessionId
            }, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.session_id) {
                setSessionId(response.data.session_id);
            }

            const botMessage = { text: response.data.response, isBot: true };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat error", error);
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="chatbot-window"
                        style={{
                            position: 'fixed',
                            bottom: '90px',
                            right: '30px',
                            width: '350px',
                            height: '500px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 5px 25px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: 1000,
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '1rem',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaRobot />
                                <span style={{ fontWeight: 'bold' }}>HR Assistant</span>
                            </div>
                            <button onClick={toggleChat} style={{ color: 'white', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                <FaTimes />
                            </button>
                        </div>

                        {/* Messages */}
                        <div style={{
                            flex: 1,
                            padding: '1rem',
                            overflowY: 'auto',
                            backgroundColor: '#f8fafc',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    style={{
                                        alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                                        backgroundColor: msg.isBot ? 'white' : 'var(--primary-color)',
                                        color: msg.isBot ? 'var(--text-primary)' : 'white',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '12px',
                                        maxWidth: '80%',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        borderBottomLeftRadius: msg.isBot ? '0' : '12px',
                                        borderBottomRightRadius: msg.isBot ? '12px' : '0'
                                    }}
                                >
                                    {msg.text}
                                </div>
                            ))}
                            {loading && (
                                <div style={{ alignSelf: 'flex-start', backgroundColor: 'white', padding: '0.75rem', borderRadius: '12px' }}>
                                    Typing...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={sendMessage} style={{
                            padding: '1rem',
                            borderTop: '1px solid var(--border-color)',
                            display: 'flex',
                            gap: '0.5rem'
                        }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '20px',
                                    outline: 'none'
                                }}
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                style={{
                                    backgroundColor: 'var(--primary-color)',
                                    color: 'white',
                                    border: 'none',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                <FaPaperPlane />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={toggleChat}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    zIndex: 1000
                }}
            >
                {isOpen ? <FaTimes /> : <FaCommentAlt />}
            </motion.button>
        </>
    );
};

export default ChatBot;
