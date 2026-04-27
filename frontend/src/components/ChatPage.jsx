import { useRef, useState } from "react"

const ChatPage = () =>{
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date(),
        }
    ]);

    const [inputMessage, setInputMessage]= useState('');

    const messagesEndRef =useRef(null);


    const handleSendMessage = (e) => {
    e.preventDefault();
    
    // Don't send empty messages
    if (inputMessage.trim() === '') return;

    // Add your message to the notebook
    const userMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
        timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage(''); // Clear the input box

    // Make the bot think for 1 second, then answer
    setTimeout(() => {
        const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
    }, 1000);
    };

    return(
        <div className="flex flex-col bg-neutral-900/90 h-screen text-gray-200">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                >
                    <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-700 text-white rounded-bl-none'
                    }`}
                    >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">
                        {formatTime(message.timestamp)}
                    </p>
                    </div>
                </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex space-x-4">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Send
                </button>
                </form>
            </div>
        </div>
    )

}

export default ChatPage