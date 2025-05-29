from flask import jsonify, request
from . import event_bp
from ..db.models import Event, db

@event_bp.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    return jsonify([{
        'id': event.id,
        'name': event.name,
        'date': event.date.isoformat(),
        'location': event.location,
        'status': event.status,
        'participant_count': event.participant_count,
        'max_participants': event.max_participants
    } for event in events])

@event_bp.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.get_or_404(event_id)
    return jsonify({
        'id': event.id,
        'name': event.name,
        'description': event.description,
        'date': event.date.isoformat(),
        'location': event.location,
        'address': event.address,
        'status': event.status,
        'participant_count': event.participant_count,
        'max_participants': event.max_participants,
        'cost': event.cost,
        'type': event.type,
        'join_type': event.join_type,
        'city': event.city,
        'image': event.image,
        'event_type': event.event_type
    })