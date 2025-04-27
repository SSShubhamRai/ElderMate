import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUser } from '../../mocks/users';
import { PhoneCall, User, Mail, Plus, Trash, Phone } from 'lucide-react';

const EmergencyContacts: React.FC = () => {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Get user with contacts
  const userWithContacts = user ? getUser(user.id) : null;
  const contacts = userWithContacts?.emergencyContacts || [];
  
  // Form state
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isEmergencyContact, setIsEmergencyContact] = useState(true);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the data to the server
    setShowAddForm(false);
    
    // Reset form
    setName('');
    setRelationship('');
    setPhone('');
    setEmail('');
    setIsEmergencyContact(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <PhoneCall className="text-primary-500 mr-3" size={24} />
          <h1 className="text-2xl font-bold text-neutral-900">Emergency Contacts</h1>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg flex items-center text-sm font-medium"
        >
          <Plus size={16} className="mr-1" />
          Add Contact
        </button>
      </div>
      
      {/* Add Contact Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Add New Contact</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="relationship" className="block text-sm font-medium text-neutral-700 mb-1">
                  Relationship
                </label>
                <input
                  id="relationship"
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="input"
                  required
                  placeholder="Son, Daughter, Friend, etc."
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input"
                  required
                  placeholder="555-123-4567"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="example@email.com"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isEmergencyContact}
                  onChange={(e) => setIsEmergencyContact(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <span className="ml-2 text-sm text-neutral-700">
                  This is an emergency contact (will be notified in case of emergency)
                </span>
              </label>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium"
              >
                Save Contact
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 py-2 px-4 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Contacts List */}
      {contacts.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-neutral-100">
            <h2 className="font-medium text-neutral-900">Your Contacts</h2>
          </div>
          
          <div className="divide-y divide-neutral-100">
            {contacts.map((contact) => (
              <div key={contact.id} className="p-4 flex flex-wrap md:flex-nowrap">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                  <User className="text-primary-600" size={24} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <h3 className="font-medium text-neutral-900 truncate">{contact.name}</h3>
                    {contact.isEmergencyContact && (
                      <span className="ml-2 badge-primary">Emergency Contact</span>
                    )}
                  </div>
                  
                  <p className="text-neutral-500 mb-2">{contact.relationship}</p>
                  
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Phone size={16} className="mr-1" />
                      {contact.phone}
                    </a>
                    
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                      >
                        <Mail size={16} className="mr-1" />
                        {contact.email}
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 md:mt-0 md:ml-4 flex items-center">
                  <button
                    className="text-neutral-500 hover:text-error-500 focus:outline-none p-1"
                    title="Remove Contact"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <PhoneCall className="mx-auto text-neutral-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">No Contacts Added</h3>
          <p className="text-neutral-500 mb-4">
            You haven't added any emergency contacts yet. These contacts will be notified in case of emergency.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg inline-flex items-center text-sm font-medium"
          >
            <Plus size={16} className="mr-1" />
            Add Your First Contact
          </button>
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts;