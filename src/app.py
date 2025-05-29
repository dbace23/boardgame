from flask import Flask
from flask_cors import CORS
from db.connection import db
from routes import init_app

app = Flask(__name__)
CORS(app)

# Configure PostgreSQL connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@host:port/database'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)

# Initialize routes
init_app(app)

if __name__ == '__main__':
    app.run(debug=True)