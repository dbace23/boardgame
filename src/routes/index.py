from flask import Blueprint, Flask
from flask_cors import CORS

# Create blueprints for different route categories
user_bp = Blueprint('user', __name__)
game_bp = Blueprint('game', __name__)
event_bp = Blueprint('event', __name__)
community_bp = Blueprint('community', __name__)
cafe_bp = Blueprint('cafe', __name__)

def init_app(app: Flask):
    # Enable CORS
    CORS(app)

    # Register blueprints
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(game_bp, url_prefix='/api/games')
    app.register_blueprint(event_bp, url_prefix='/api/events')
    app.register_blueprint(community_bp, url_prefix='/api/communities')
    app.register_blueprint(cafe_bp, url_prefix='/api/cafes')

# Import routes after blueprint creation to avoid circular imports
from . import user_routes
from . import game_routes
from . import event_routes
from . import community_routes
from . import cafe_routes