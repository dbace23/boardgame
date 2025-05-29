/*
  # Add Auction Tables

  1. New Tables
    - auctions
      - id (uuid, primary key)
      - game_id (uuid, references games)
      - seller_id (uuid, references users)
      - title (text)
      - description (text)
      - start_price (numeric)
      - current_price (numeric)
      - buy_now_price (numeric, optional)
      - start_time (timestamptz)
      - end_time (timestamptz)
      - status (text)
      - condition (text)
      - shipping_info (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - auction_bids
      - id (uuid, primary key)
      - auction_id (uuid, references auctions)
      - bidder_id (uuid, references users)
      - bid_amount (numeric)
      - bid_time (timestamptz)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Triggers
    - Add triggers for updating timestamps
    - Add trigger for updating current_price when new bid is placed
*/

-- Create auctions table
CREATE TABLE auctions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  start_price numeric NOT NULL CHECK (start_price > 0),
  current_price numeric NOT NULL CHECK (current_price >= start_price),
  buy_now_price numeric CHECK (buy_now_price > start_price),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL CHECK (end_time > start_time),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'ended', 'cancelled')),
  condition text NOT NULL CHECK (condition IN ('new', 'like_new', 'very_good', 'good', 'acceptable')),
  shipping_info text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Create auction_bids table
CREATE TABLE auction_bids (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auction_id uuid REFERENCES auctions(id) ON DELETE CASCADE NOT NULL,
  bidder_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  bid_amount numeric NOT NULL,
  bid_time timestamptz DEFAULT CURRENT_TIMESTAMP,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_bid_amount CHECK (bid_amount > 0)
);

-- Create updated_at triggers
CREATE TRIGGER update_auctions_updated_at
  BEFORE UPDATE ON auctions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auction_bids_updated_at
  BEFORE UPDATE ON auction_bids
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to update current price
CREATE OR REPLACE FUNCTION update_auction_current_price()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auctions
  SET current_price = NEW.bid_amount
  WHERE id = NEW.auction_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating current price
CREATE TRIGGER update_auction_price
  AFTER INSERT ON auction_bids
  FOR EACH ROW
  EXECUTE FUNCTION update_auction_current_price();

-- Enable Row Level Security
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_bids ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Auctions policies
CREATE POLICY "Anyone can view auctions"
  ON auctions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create auctions"
  ON auctions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their auctions"
  ON auctions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id AND status = 'pending');

CREATE POLICY "Sellers can delete their pending auctions"
  ON auctions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = seller_id AND status = 'pending');

-- Auction bids policies
CREATE POLICY "Anyone can view bids"
  ON auction_bids
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can place bids"
  ON auction_bids
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = bidder_id AND
    EXISTS (
      SELECT 1 FROM auctions
      WHERE id = auction_id
      AND status = 'active'
      AND end_time > CURRENT_TIMESTAMP
      AND seller_id != auth.uid()
    )
  );