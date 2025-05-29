import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Banner from '../components/layout/Banner';
import { Award, MapPin, Trophy } from 'lucide-react';

interface RankingData {
  rank: number;
  name: string;
  score: number;
  city: string;
  change?: 'up' | 'down' | 'same';
}

const mockWeeklyRankings: RankingData[] = [
  { rank: 1, name: "Chess Club Masters", score: 2500, city: "New York", change: 'up' },
  { rank: 2, name: "Strategy Gaming Elite", score: 2450, city: "Los Angeles", change: 'down' },
  { rank: 3, name: "Board Game Champions", score: 2400, city: "Chicago", change: 'same' },
];

const mockMonthlyRankings: RankingData[] = [
  { rank: 1, name: "Dice Tower Veterans", score: 10500, city: "Boston", change: 'up' },
  { rank: 2, name: "Meeple Masters", score: 10200, city: "Seattle", change: 'same' },
  { rank: 3, name: "Card Game Legends", score: 9800, city: "Miami", change: 'down' },
];

const mockCityRankings: Record<string, RankingData[]> = {
  "New York": [
    { rank: 1, name: "Manhattan Gamers", score: 5000, city: "New York" },
    { rank: 2, name: "Brooklyn Board Games", score: 4800, city: "New York" },
    { rank: 3, name: "Queens Gaming Club", score: 4600, city: "New York" },
  ],
  "Los Angeles": [
    { rank: 1, name: "LA Gaming Elite", score: 4800, city: "Los Angeles" },
    { rank: 2, name: "Valley Gamers", score: 4500, city: "Los Angeles" },
    { rank: 3, name: "Downtown Dice", score: 4300, city: "Los Angeles" },
  ],
};

const RankingPage: React.FC = () => {
  const [isAuthenticated] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("New York");

  const renderRankingRow = (data: RankingData, showCity: boolean = true) => (
    <div key={data.name} className="flex items-center justify-between p-4 hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        <span className="font-semibold text-lg w-8">{data.rank}</span>
        <div>
          <h3 className="font-medium">{data.name}</h3>
          {showCity && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {data.city}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="font-semibold">{data.score}</span>
        {data.change && (
          <div className={`text-sm ${
            data.change === 'up' ? 'text-green-600' :
            data.change === 'down' ? 'text-red-600' :
            'text-gray-600'
          }`}>
            {data.change === 'up' ? '↑' : data.change === 'down' ? '↓' : '−'}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={isAuthenticated} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Banner 
          title="Community Rankings" 
          subtitle="See how communities stack up against each other" 
          image="https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg"
        />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Weekly Rankings */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Weekly Rankings</h2>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {mockWeeklyRankings.map(ranking => renderRankingRow(ranking))}
            </div>
          </div>

          {/* Monthly Rankings */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-purple-600 text-white p-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Monthly Rankings</h2>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {mockMonthlyRankings.map(ranking => renderRankingRow(ranking))}
            </div>
          </div>

          {/* City Rankings */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">City Rankings</h2>
                </div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="text-gray-900 text-sm rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {Object.keys(mockCityRankings).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {mockCityRankings[selectedCity].map(ranking => renderRankingRow(ranking, false))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RankingPage;