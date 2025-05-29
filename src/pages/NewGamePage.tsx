import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Upload, Plus, X } from 'lucide-react';

const NewGamePage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    publisher: '',
    ageRecommendation: '',
    playerCount: '',
    image: '',
    categories: [] as string[],
    mechanics: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    navigate('/');
  };

  const categoryOptions = ['Strategy', 'Family', 'Party', 'Card Game', 'Abstract', 'Cooperative'];
  const mechanicOptions = ['Dice Rolling', 'Trading', 'Set Collection', 'Route Building', 'Cooperative', 'Tile Placement'];

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleMechanic = (mechanic: string) => {
    setFormData(prev => ({
      ...prev,
      mechanics: prev.mechanics.includes(mechanic)
        ? prev.mechanics.filter(m => m !== mechanic)
        : [...prev.mechanics, mechanic]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={isAuthenticated} />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Add New Game</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Game Image
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
                  Game Name
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publisher
                  </label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Recommendation
                  </label>
                  <input
                    type="text"
                    value={formData.ageRecommendation}
                    onChange={(e) => setFormData({ ...formData, ageRecommendation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., 10+"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Player Count
                  </label>
                  <input
                    type="text"
                    value={formData.playerCount}
                    onChange={(e) => setFormData({ ...formData, playerCount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., 2-4"
                    required
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map(category => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        formData.categories.includes(category)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {formData.categories.includes(category) && (
                        <X className="w-4 h-4 inline-block mr-1" />
                      )}
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mechanics */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Game Mechanics
                </label>
                <div className="flex flex-wrap gap-2">
                  {mechanicOptions.map(mechanic => (
                    <button
                      key={mechanic}
                      type="button"
                      onClick={() => toggleMechanic(mechanic)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        formData.mechanics.includes(mechanic)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {formData.mechanics.includes(mechanic) && (
                        <X className="w-4 h-4 inline-block mr-1" />
                      )}
                      {mechanic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Game
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewGamePage;