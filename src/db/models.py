from .connection import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(20))
    city = db.Column(db.String(100))
    gender = db.Column(db.String(20))
    board_game_geek_account = db.Column(db.String(100))
    age = db.Column(db.Integer)
    joined_date = db.Column(db.DateTime, default=datetime.utcnow)
    profile_image = db.Column(db.String(255))

class Game(db.Model):
    __tablename__ = 'games'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(255))
    description = db.Column(db.Text)
    publisher = db.Column(db.String(100))
    age_recommendation = db.Column(db.String(20))
    player_count = db.Column(db.String(20))
    rating = db.Column(db.Float)
    likes = db.Column(db.Integer, default=0)
    owners = db.Column(db.Integer, default=0)
    comments = db.Column(db.Integer, default=0)

class Community(db.Model):
    __tablename__ = 'communities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    city = db.Column(db.String(100))
    member_count = db.Column(db.Integer, default=0)
    administrator_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    main_area = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    image = db.Column(db.String(255))

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(100))
    address = db.Column(db.String(255))
    status = db.Column(db.String(20), default='recruiting')
    participant_count = db.Column(db.Integer, default=0)
    max_participants = db.Column(db.Integer)
    cost = db.Column(db.String(20))
    organizer_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    type = db.Column(db.String(20))
    join_type = db.Column(db.String(20))
    city = db.Column(db.String(100))
    image = db.Column(db.String(255))
    event_type = db.Column(db.String(20))

class Cafe(db.Model):
    __tablename__ = 'cafes'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100))
    address = db.Column(db.String(255))
    weekday_hours = db.Column(db.String(100))
    weekend_hours = db.Column(db.String(100))
    holiday_hours = db.Column(db.String(100))
    average_budget = db.Column(db.String(20))
    board_game_count = db.Column(db.Integer, default=0)
    event_count = db.Column(db.Integer, default=0)
    image = db.Column(db.String(255))