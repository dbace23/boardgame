from flask import jsonify, request
from . import community_bp
from ..db.models import Community, db

@community_bp.route('/communities', methods=['GET'])
def get_communities():
    communities = Community.query.all()
    return jsonify([{
        'id': community.id,
        'name': community.name,
        'city': community.city,
        'member_count': community.member_count,
        'main_area': community.main_area
    } for community in communities])

@community_bp.route('/communities/<int:community_id>', methods=['GET'])
def get_community(community_id):
    community = Community.query.get_or_404(community_id)
    return jsonify({
        'id': community.id,
        'name': community.name,
        'description': community.description,
        'city': community.city,
        'member_count': community.member_count,
        'main_area': community.main_area,
        'created_at': community.created_at.isoformat(),
        'image': community.image
    })