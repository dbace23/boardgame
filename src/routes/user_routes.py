from flask import jsonify, request
from . import user_bp
from ..db.models import User, db

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'city': user.city,
        'joined_date': user.joined_date.isoformat()
    } for user in users])

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone_number': user.phone_number,
        'city': user.city,
        'gender': user.gender,
        'board_game_geek_account': user.board_game_geek_account,
        'age': user.age,
        'joined_date': user.joined_date.isoformat(),
        'profile_image': user.profile_image
    })

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(
        name=data['name'],
        email=data['email'],
        phone_number=data.get('phone_number'),
        city=data.get('city'),
        gender=data.get('gender'),
        board_game_geek_account=data.get('board_game_geek_account'),
        age=data.get('age'),
        profile_image=data.get('profile_image')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully', 'id': new_user.id}), 201

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    for key, value in data.items():
        if hasattr(user, key):
            setattr(user, key, value)
    
    db.session.commit()
    return jsonify({'message': 'User updated successfully'})