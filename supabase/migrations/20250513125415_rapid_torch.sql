/*
  # Initial Schema for Board Game Community Platform

  1. New Tables
    - users
      - id (uuid, primary key)
      - name (text)
      - email (text, unique)
      - phone_number (text, unique)
      - city (text)
      - gender (text)
      - board_game_geek_account (text)
      - age (integer)
      - joined_date (timestamptz)
      - profile_image (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - games
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - image (text)
      - publisher (text)
      - age_recommendation (text)
      - player_count (text)
      - categories (text[])
      - mechanics (text[])
      - rating (numeric)
      - likes (integer)
      - owners (integer)
      - comments (integer)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - communities
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - city (text)
      - member_count (integer)
      - administrator_id (uuid, references users)
      - main_area (text)
      - activities (text[])
      - image (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - events
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - date (timestamptz)
      - location (text)
      - address (text)
      - status (text)
      - participant_count (integer)
      - max_participants (integer)
      - cost (text)
      - organizer_id (uuid, references users)
      - type (text)
      - join_type (text)
      - city (text)
      - image (text)
      - event_type (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - cafes
      - id (uuid, primary key)
      - name (text)
      - location (text)
      - address (text)
      - weekday_hours (text)
      - weekend_hours (text)
      - holiday_hours (text)
      - average_budget (text)
      - board_game_count (integer)
      - event_count (integer)
      - image (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Triggers
    - Add triggers for updating timestamps
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text UNIQUE,
  phone_number text UNIQUE NOT NULL,
  city text,
  gender text,
  board_game_geek_account text,
  age integer,
  joined_date timestamptz DEFAULT CURRENT_TIMESTAMP,
  profile_image text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create games table
CREATE TABLE games (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  image text,
  publisher text,
  age_recommendation text,
  player_count text,
  categories text[],
  mechanics text[],
  rating numeric DEFAULT 0,
  likes integer DEFAULT 0,
  owners integer DEFAULT 0,
  comments integer DEFAULT 0,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create communities table
CREATE TABLE communities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  city text NOT NULL,
  member_count integer DEFAULT 0,
  administrator_id uuid REFERENCES users(id),
  main_area text,
  activities text[],
  image text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  date timestamptz NOT NULL,
  location text NOT NULL,
  address text,
  status text DEFAULT 'recruiting',
  participant_count integer DEFAULT 0,
  max_participants integer NOT NULL,
  cost text DEFAULT 'free',
  organizer_id uuid REFERENCES users(id),
  type text DEFAULT 'meetup',
  join_type text DEFAULT 'public',
  city text,
  image text,
  event_type text DEFAULT 'offline',
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_status CHECK (status IN ('recruiting', 'full')),
  CONSTRAINT valid_type CHECK (type IN ('meetup', 'competition')),
  CONSTRAINT valid_join_type CHECK (join_type IN ('public', 'companion')),
  CONSTRAINT valid_event_type CHECK (event_type IN ('offline', 'online'))
);

-- Create cafes table
CREATE TABLE cafes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  location text NOT NULL,
  address text,
  weekday_hours text,
  weekend_hours text,
  holiday_hours text,
  average_budget text,
  board_game_count integer DEFAULT 0,
  event_count integer DEFAULT 0,
  image text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communities_updated_at
  BEFORE UPDATE ON communities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cafes_updated_at
  BEFORE UPDATE ON cafes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafes ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Games policies
CREATE POLICY "Anyone can view games"
  ON games
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create games"
  ON games
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Game owners can update games"
  ON games
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.board_game_geek_account IS NOT NULL
  ));

-- Communities policies
CREATE POLICY "Anyone can view communities"
  ON communities
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create communities"
  ON communities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Community administrators can update communities"
  ON communities
  FOR UPDATE
  TO authenticated
  USING (administrator_id = auth.uid());

-- Events policies
CREATE POLICY "Anyone can view events"
  ON events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Event organizers can update events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (organizer_id = auth.uid());

-- Cafes policies
CREATE POLICY "Anyone can view cafes"
  ON cafes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create cafes"
  ON cafes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Cafe owners can update cafes"
  ON cafes
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.board_game_geek_account IS NOT NULL
  ));