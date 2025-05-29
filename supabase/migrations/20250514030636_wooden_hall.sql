/*
  # Add Entity Members Tables for Role Management

  1. New Tables
    - community_members
      - id (uuid, primary key)
      - community_id (uuid, references communities)
      - user_id (uuid, references users)
      - role (text)
      - joined_at (timestamptz)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - cafe_members
      - id (uuid, primary key)
      - cafe_id (uuid, references cafes)
      - user_id (uuid, references users)
      - role (text)
      - joined_at (timestamptz)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - event_members
      - id (uuid, primary key)
      - event_id (uuid, references events)
      - user_id (uuid, references users)
      - role (text)
      - joined_at (timestamptz)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create community_members table
CREATE TABLE community_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(community_id, user_id)
);

-- Create cafe_members table
CREATE TABLE cafe_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cafe_id uuid REFERENCES cafes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(cafe_id, user_id)
);

-- Create event_members table
CREATE TABLE event_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, user_id)
);

-- Create updated_at triggers
CREATE TRIGGER update_community_members_updated_at
  BEFORE UPDATE ON community_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cafe_members_updated_at
  BEFORE UPDATE ON cafe_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_members_updated_at
  BEFORE UPDATE ON event_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafe_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_members ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Community Members policies
CREATE POLICY "Anyone can view community members"
  ON community_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Community admins can manage members"
  ON community_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM community_members cm
      WHERE cm.community_id = community_members.community_id
      AND cm.user_id = auth.uid()
      AND cm.role = 'admin'
    )
  );

-- Cafe Members policies
CREATE POLICY "Anyone can view cafe members"
  ON cafe_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Cafe admins can manage members"
  ON cafe_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cafe_members cm
      WHERE cm.cafe_id = cafe_members.cafe_id
      AND cm.user_id = auth.uid()
      AND cm.role = 'admin'
    )
  );

-- Event Members policies
CREATE POLICY "Anyone can view event members"
  ON event_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Event admins can manage members"
  ON event_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM event_members em
      WHERE em.event_id = event_members.event_id
      AND em.user_id = auth.uid()
      AND em.role = 'admin'
    )
  );