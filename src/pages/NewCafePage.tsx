import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Upload, MapPin, Clock, DollarSign, Package } from 'lucide-react';

const NewCafePage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    address: '',
    weekdayHours: '',
    weekendHours: '',
    holidayHours: '',
    averageBudget: '',
    boardGameCount: '',
    image: '',
    facilities: [] as string[],
    services: [] as string[]
  });

  const facilityOptions = [
    'Air Conditioning',
    'Free WiFi',
    'Private Rooms',
    'Event Space',
    'Food Service',
    'Beverage Service',
    'Parking',
    'Accessible Entrance'
  ];

  const serviceOptions = [
    'Game Rentals',
    'Game Sales',
    'Game Teaching',
    'Tournament Hosting',
    'Birthday Parties',
    'Corporate Events',
    'Game Library',
    'Membership Program'
  ];

  const budgetOptions = [
    '$5-10',
    '$10-20',
    '$20-30',
    '$30-50',
    '$50+'
  ];

  const toggleOption = (type: 'facilities' | 'services', value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    navigate('/cafes');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={isAuthenticated} />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Add New Cafe/Shop</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cafe/Shop Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Drag and drop an image, or click to select
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cafe/Shop Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline-block mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., Downtown"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Operating Hours */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline-block mr-1" />
                  Operating Hours
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Weekdays</label>
                    <input
                      type="text"
                      value={formData.weekdayHours}
                      onChange={(e) => setFormData({ ...formData, weekdayHours: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., 10:00 AM - 10:00 PM"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Weekends</label>
                    <input
                      type="text"
                      value={formData.weekendHours}
                      onChange={(e) => setFormData({ ...formData, weekendHours: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., 11:00 AM - 11:00 PM"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Holidays</label>
                    <input
                      type="text"
                      value={formData.holidayHours}
                      onChange={(e) => setFormData({ ...formData, holidayHours: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., 12:00 PM - 8:00 PM"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Budget and Games */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline-block mr-1" />
                    Average Budget
                  </label>
                  <select
                    value={formData.averageBudget}
                    onChange={(e) => setFormData({ ...formData, averageBudget: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select budget range</option>
                    {budgetOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="w-4 h-4 inline-block mr-1" />
                    Board Game Count
                  </label>
                  <input
                    type="number"
                    value={formData.boardGameCount}
                    onChange={(e) => setFormData({ ...formData, boardGameCount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Facilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facilities
                </label>
                <div className="flex flex-wrap gap-2">
                  {facilityOptions.map(facility => (
                    <button
                      key={facility}
                      type="button"
                      onClick={() => toggleOption('facilities', facility)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        formData.facilities.includes(facility)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {facility}
                    </button>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services
                </label>
                <div className="flex flex-wrap gap-2">
                  {serviceOptions.map(service => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleOption('services', service)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        formData.services.includes(service)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/cafes')}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Cafe/Shop
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewCafePage;