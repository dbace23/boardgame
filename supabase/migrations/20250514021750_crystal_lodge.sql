/*
  # Add Comments and Ratings Tables

  1. New Tables
    - comments
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - content (text)
      - entity_id (uuid)
      - entity_type (text)
      - parent_id (uuid, self-reference for replies)
      - likes (integer)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - ratings
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - entity_id (uuid)
      - entity_type (text)
      - rating (numeric)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Triggers
    - Add triggers for updating timestamps
    - Add triggers for updating average ratings
*/

-- Create comments table
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  entity_id uuid NOT NULL,
  entity_type text NOT NULL,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_entity_type CHECK (entity_type IN ('game', 'event', 'community', 'cafe'))
);

-- Create ratings table
CREATE TABLE ratings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  entity_id uuid NOT NULL,
  entity_type text NOT NULL,
  rating numeric NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_entity_type CHECK (entity_type IN ('game', 'event', 'community', 'cafe')),
  UNIQUE (user_id, entity_id, entity_type)
);

-- Create updated_at triggers
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at
  BEFORE UPDATE ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to update average rating
CREATE OR REPLACE FUNCTION update_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Update average rating for the entity
    EXECUTE format(
      'UPDATE %I SET rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM ratings
        WHERE entity_id = $1
        AND entity_type = $2
      )
      WHERE id = $1',
      NEW.entity_type
    )
    USING NEW.entity_id, NEW.entity_type;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating average rating
CREATE TRIGGER update_entity_rating
  AFTER INSERT OR UPDATE ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_average_rating();

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for comments
CREATE POLICY "Anyone can view comments"
  ON comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS Policies for ratings
CREATE POLICY "Anyone can view ratings"
  ON ratings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create ratings"
  ON ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
  ON ratings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);