from flask import Blueprint

# Create blueprints for different route categories
user_bp = Blueprint('user', __name__)
game_bp = Blueprint('game', __name__)
event_bp = Blueprint('event', __name__)
community_bp = Blueprint('community', __name__)
cafe_bp = Blueprint('cafe', __name__)

# Import routes
from . import user_routes
from . import game_routes
from . import event_routes
from . import community_routes
from . import cafe_routes