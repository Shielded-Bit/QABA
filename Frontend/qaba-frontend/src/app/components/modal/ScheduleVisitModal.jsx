import React, { useState } from 'react';

const ScheduleVisitModal = ({ isOpen, onClose, property }) => {
  const [propertyName, setPropertyName] = useState(property?.property_name || "");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  // Debug: Log the property to see what's being passed
  console.log("Property passed to modal:", property);
  console.log("Property name:", property?.property_name);

  // Update propertyName when property changes
  React.useEffect(() => {
    if (property?.property_name) {
      setPropertyName(property.property_name);
    }
  }, [property]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can replace this with your actual submit logic (API call, etc)
    alert(`Request submitted!\nProperty: ${propertyName}\nName: ${userName}\nEmail: ${email}\nDate: ${date}\nMessage: ${message}`);
    
    // Optionally reset form or close modal
    // setPropertyName(property?.property_name || "");
    // setUserName("");
    // setEmail("");
    // setDate("");
    // setMessage("");
    // onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 bg-gradient-to-r from-blue-900 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition">
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-green-600">
          Schedule a Visit for <span className="text-gray-900 bg-none">{propertyName || property?.property_name || "this property"}</span>
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-1">Property Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              required
              placeholder="Enter property name"
              value={propertyName}
              onChange={e => setPropertyName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Your Name</label>
            <input type="text" className="w-full border rounded px-3 py-2" required value={userName} onChange={e => setUserName(e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Preferred Date</label>
            <input type="date" className="w-full border rounded px-3 py-2" required value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Message</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={4}
              placeholder="Type your message here..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full py-2 rounded font-semibold bg-gradient-to-r from-blue-900 to-green-600 text-white hover:opacity-90 transition">Submit Request</button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleVisitModal;