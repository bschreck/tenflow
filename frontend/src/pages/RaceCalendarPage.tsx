import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  Mountain,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Race {
  id: string;
  name: string;
  location: string;
  date: string;
  distance: string;
  elevation: string;
  terrain: string[];
  category: 'featured' | 'more';
}

const featuredRaces: Race[] = [
  {
    id: "utmb",
    name: "Ultra-Trail du Mont-Blanc",
    location: "Chamonix, France",
    date: "August 2024",
    distance: "171K",
    elevation: "+10,040m",
    terrain: ["Alpine", "Technical"],
    category: 'featured',
  },
  {
    id: "western-states",
    name: "Western States 100",
    location: "California, USA",
    date: "June 2024",
    distance: "100M",
    elevation: "+5,677m",
    terrain: ["Mountain", "Desert"],
    category: 'featured',
  },
  {
    id: "hardrock",
    name: "Hardrock 100",
    location: "Colorado, USA",
    date: "July 2024",
    distance: "100M",
    elevation: "+10,180m",
    terrain: ["High Alpine"],
    category: 'featured',
  },
];

const moreRaces: Race[] = [
  {
    id: "badwater",
    name: "Badwater 135",
    location: "Death Valley, USA",
    date: "July 2024",
    distance: "135M",
    elevation: "+4,023m",
    terrain: ["Desert", "Extreme Heat"],
    category: 'more',
  },
  {
    id: "tor-des-geants",
    name: "Tor des Géants",
    location: "Valle d'Aosta, Italy",
    date: "September 2024",
    distance: "330K",
    elevation: "+24,000m",
    terrain: ["Alpine", "Technical"],
    category: 'more',
  },
  {
    id: "angeles-crest",
    name: "Angeles Crest 100",
    location: "California, USA",
    date: "August 2024",
    distance: "100M",
    elevation: "+6,096m",
    terrain: ["Mountain", "Technical"],
    category: 'more',
  },
];

const BottomNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        <div className="flex flex-col items-center py-2">
          <div className="w-6 h-6 mb-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
          <span className="text-xs text-gray-600">Home</span>
        </div>
        <div className="flex flex-col items-center py-2">
          <div className="w-6 h-6 mb-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <span className="text-xs text-gray-600">Today</span>
        </div>
        <div className="flex flex-col items-center py-2 text-blue-600">
          <Calendar className="w-6 h-6 mb-1" />
          <span className="text-xs">Plan</span>
        </div>
        <div className="flex flex-col items-center py-2">
          <div className="w-6 h-6 mb-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
            </svg>
          </div>
          <span className="text-xs text-gray-600">Progress</span>
        </div>
        <div className="flex flex-col items-center py-2">
          <div className="w-6 h-6 mb-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <span className="text-xs text-gray-600">Profile</span>
        </div>
      </div>
    </div>
  );
};

const RaceCard = ({ race }: { race: Race }) => {
  const getBadgeStyle = (raceName: string) => {
    if (raceName === "Angeles Crest 100") {
      return "px-2 py-1 bg-gray-600 text-white text-xs rounded-full";
    }
    return "px-2 py-1 bg-red-500 text-white text-xs rounded-full";
  };

  const getBadgeText = (raceName: string) => {
    if (raceName === "Angeles Crest 100") {
      return "Advanced";
    }
    return "Elite";
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">{race.name}</h3>
              <span className={getBadgeStyle(race.name)}>
                {getBadgeText(race.name)}
              </span>
            </div>
            
            <div className="space-y-1 mb-3">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{race.location} • {race.date}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>{race.distance}</span>
                </div>
                <div className="flex items-center">
                  <Mountain className="w-4 h-4 mr-1" />
                  <span>{race.elevation}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {race.terrain.map((terrain, index) => (
                <span key={index} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {terrain}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function RaceCalendarPage() {
  const navigate = useNavigate();
  const [selectedRace, setSelectedRace] = useState<string | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between max-w-md mx-auto mb-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="w-10"></div>
        </div>
        
        <div className="text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Race Calendar
          </h1>
          <p className="text-gray-600">
            Choose from world-class trail races
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        
        {/* Featured Section */}
        <div>
          <div className="flex items-center mb-4">
            <span className="px-3 py-1 bg-gray-800 text-white text-sm rounded-full mr-3">
              Featured
            </span>
            <h2 className="text-lg font-semibold text-gray-900">Iconic Ultra Races</h2>
          </div>
          
          <div className="space-y-3">
            {featuredRaces.map((race) => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        </div>

        {/* More Races Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">More Races</h2>
          
          <div className="space-y-3">
            {moreRaces.map((race) => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        </div>

        {/* Request a Race Section */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">
              Don't see your race? We're constantly adding new events.
            </p>
            <Button 
              variant="outline"
              className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
            >
              Request a Race
            </Button>
          </CardContent>
        </Card>

      </div>

      <BottomNavigation />
    </div>
  );
}
