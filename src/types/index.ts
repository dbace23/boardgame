// Base interface for common properties
interface BaseEntity {
  id: string;
  name: string;
  image?: string;
}

export interface User extends BaseEntity {
  phoneNumber: string;
  city: string;
  gender?: string;
  email?: string;
  boardGameGeekAccount?: string;
  age?: number;
  joinedDate: string;
  profileImage?: string;
}

export interface Game extends BaseEntity {
  description: string;
  categories: string[];
  publisher: string;
  ageRecommendation: string;
  playerCount: string;
  mechanics: string[];
  rating: number;
  likes: number;
  owners: number;
  comments: number;
}

export interface CommunityMember extends User {
  role: 'admin' | 'moderator' | 'member';
  joinDate: string;
  lastActive: string;
}

export interface Community extends BaseEntity {
  description: string;
  city: string;
  memberCount: number;
  lastActive: string;
  activities: string[];
  administrator: string;
  mainArea: string;
  mainLocations: string[];
  members: CommunityMember[];
}

export interface Event extends BaseEntity {
  description: string;
  date: string;
  location: string;
  address: string;
  status: 'recruiting' | 'full';
  participantCount: number;
  maxParticipants: number;
  cost: string;
  organizer: string;
  boardGames: string[];
  type?: 'meetup' | 'competition';
  joinType?: 'public' | 'companion';
  city?: string;
  eventType?: 'offline' | 'online';
}

export interface Cafe extends BaseEntity {
  location: string;
  address: string;
  openingHours: {
    weekdays: string;
    weekends: string;
    holidays: string;
  };
  averageBudget: string;
  boardGameCount: number;
  eventCount: number;
  isFollowing: boolean;
}

export const PLACEHOLDER_IMAGES = {
  PROFILE: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg',
  GAME: 'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg',
  EVENT: 'https://images.pexels.com/photos/4691567/pexels-photo-4691567.jpeg',
  COMMUNITY: 'https://images.pexels.com/photos/7594067/pexels-photo-7594067.jpeg',
  CAFE: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg'
} as const;