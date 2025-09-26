// page.jsx
'use client';

import { useState } from 'react';
import { User, Smile, Send } from 'lucide-react';
import Image from 'next/image';

const people = [
  { id: 1, name: 'John Doe', lastMessage: 'Hey, how are you?', avatar: 'https://i.pravatar.cc/150', unreadCount: 2 },
  { id: 2, name: 'Jane Smith', lastMessage: 'See you later!', avatar: 'https://i.pravatar.cc/150', unreadCount: 0 },
  { id: 3, name: 'Alice Johnson', lastMessage: 'What’s up?', avatar: 'https://i.pravatar.cc/150', unreadCount: 5 },
];

const initialMessages = {
  1: [
    { id: 1, text: 'Hey, how are you?', sender: 'John Doe', avatar: 'https://i.pravatar.cc/150' },
    { id: 2, text: 'I’m good, thanks!', sender: 'You', avatar: 'https://i.pravatar.cc/150' },
  ],
  2: [
    { id: 1, text: 'See you later!', sender: 'Jane Smith', avatar: 'https://i.pravatar.cc/150' },
    { id: 2, text: 'Sure, take care!', sender: 'You', avatar: 'https://i.pravatar.cc/150' },
  ],
  3: [
    { id: 1, text: 'What’s up?', sender: 'Alice Johnson', avatar: 'https://via.placeholder.com/40' },
    { id: 2, text: 'Not much, just working.', sender: 'You', avatar: 'https://via.placeholder.com/40' },
  ],
};

export default function ChatPage() {
  const [selectedPerson, setSelectedPerson] = useState(null); // No chat is active initially
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [unreadCounts, setUnreadCounts] = useState(
    people.reduce((acc, person) => {
      acc[person.id] = person.unreadCount;
      return acc;
    }, {})
  );

  const handleSendMessage = () => {
    if (inputValue.trim() && selectedPerson) {
      const newMessage = {
        id: messages[selectedPerson].length + 1,
        text: inputValue,
        sender: 'You',
        avatar: 'https://i.pravatar.cc/150',
      };
      setMessages({
        ...messages,
        [selectedPerson]: [...messages[selectedPerson], newMessage],
      });
      setInputValue('');
    }
  };

  const handleSelectPerson = (personId) => {
    setSelectedPerson(personId);
    setUnreadCounts((prev) => ({ ...prev, [personId]: 0 })); 
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="p-4 lg:p-6">
        <h1 className="text-lg font-semibold text-gray-600">Messages</h1>
      </div>

      {/* Main Content */}
      <div className="flex h-full">
        {/* Left Side: Chat List */}
        <div className="w-64 bg-white border-r border-gray-200 p-1">
          <ul className="space-y-2">
            {people.map((person) => (
              <li key={person.id}>
                <button
                  onClick={() => handleSelectPerson(person.id)}
                  className={`flex items-center justify-between space-x-3 text-gray-700 hover:bg-gray-50 rounded-lg p-3 w-full transition-all duration-200 ${
                    selectedPerson === person.id ? 'bg-blue-50 border border-blue-100 shadow-sm' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Image src={person.avatar} alt={person.name} width={32} height={32} className="w-8 h-8 rounded-full" />
                    <div className="text-left">
                      <p className={`text-sm ${selectedPerson === person.id ? 'font-semibold text-gradient' : 'font-medium'}`}>
                        {person.name}
                      </p>
                      <p className="text-xs text-gray-500">{person.lastMessage}</p>
                    </div>
                  </div>
                  {unreadCounts[person.id] > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {unreadCounts[person.id]}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side: Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          {selectedPerson ? (
            <div className="bg-white p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">
                {people.find((person) => person.id === selectedPerson)?.name}
              </h2>
            </div>
          ) : (
            <div className="bg-white p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-500">Select a chat to start messaging</h2>
            </div>
          )}

          {/* Chat Messages */}
          {selectedPerson && (
            <div className="flex-grow overflow-y-auto p-4">
              {messages[selectedPerson].map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 mb-4 ${
                    message.sender === 'You' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender !== 'You' && (
                    <Image src={message.avatar} alt={message.sender} width={32} height={32} className="w-8 h-8 rounded-full" />
                  )}
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      message.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 shadow-sm'
                    }`}
                  >
                    <p>{message.text}</p>
                  </div>
                  {message.sender === 'You' && (
                    <Image src={message.avatar} alt={message.sender} width={32} height={32} className="w-8 h-8 rounded-full" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Chat Input */}
          {selectedPerson && (
            <div className="bg-white p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Smile className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 text-blue-500 hover:text-blue-600"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}