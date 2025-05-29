from flask import jsonify, request
from . import game_bp
from ..db.repositories.game_repository import GameRepository

game_repo = GameRepository()

@game_bp.route('/games', methods=['GET'])
def get_games():
    category = request.args.get('category')
    trending = request.args.get('trending', type=bool)
    min_rating = request.args.get('min_rating', type=float)

    if category:
        games = game_repo.find_by_category(category)
    elif trending:
        games = game_repo.find_trending()
    elif min_rating:
        games = game_repo.find_by_rating(min_rating)
    else:
        games = game_repo.find_all()

    return jsonify(games)

@game_bp.route('/games/<string:game_id>', methods=['GET'])
def get_game(game_id):
    game = game_repo.find_by_id(game_id)
    if not game:
        return jsonify({'error': 'Game not found'}), 404
    return jsonify(game)

@game_bp.route('/games', methods=['POST'])
def create_game():
    data = request.get_json()
    game = game_repo.create(data)
    return jsonify(game), 201

@game_bp.route('/games/<string:game_id>', methods=['PUT'])
def update_game(game_id):
    data = request.get_json()
    game = game_repo.update(game_id, data)
    return jsonify(game)

@game_bp.route('/games/<string:game_id>', methods=['DELETE'])
def delete_game(game_id):
    success = game_repo.delete(game_id)
    if not success:
        return jsonify({'error': 'Game not found'}), 404
    return '', 204