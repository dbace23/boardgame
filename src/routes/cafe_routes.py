from flask import jsonify, request
from . import cafe_bp
from ..db.models import Cafe, db

@cafe_bp.route('/cafes', methods=['GET'])
def get_cafes():
    cafes = Cafe.query.all()
    return jsonify([{
        'id': cafe.id,
        'name': cafe.name,
        'location': cafe.location,
        'board_game_count': cafe.board_game_count,
        'event_count': cafe.event_count
    } for cafe in cafes])

@cafe_bp.route('/cafes/<int:cafe_id>', methods=['GET'])
def get_cafe(cafe_id):
    cafe = Cafe.query.get_or_404(cafe_id)
    return jsonify({
        'id': cafe.id,
        'name': cafe.name,
        'location': cafe.location,
        'address': cafe.address,
        'weekday_hours': cafe.weekday_hours,
        'weekend_hours': cafe.weekend_hours,
        'holiday_hours': cafe.holiday_hours,
        'average_budget': cafe.average_budget,
        'board_game_count': cafe.board_game_count,
        'event_count': cafe.event_count,
        'image': cafe.image
    })