from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from flask_cors import CORS
import uuid

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, support_credentials=True) 
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

    db.init_app(app)
    migrate.init_app(app, db)

    class Note(db.Model):
        __tablename__ = 'note'
        __table_args__ = {'extend_existing': True}
        id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
        title = db.Column(db.String(120), nullable=False)
        tags = db.Column(db.String(120), nullable=True)
        body = db.Column(db.String(500), nullable=False)
        created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
        updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

        def to_dict(self):
            return {
                'id': self.id,
                'title': self.title,
                'tags': self.tags.split(",") if self.tags else [],
                'body': self.body,
                'created_at': self.created_at,
                'updated_at': self.updated_at
            }

    @app.route('/')
    def home():
        return render_template('index.html')

    @app.route('/notes', methods=['GET'])
    def get_notes():
        notes = Note.query.all()
        response = jsonify([note.to_dict() for note in notes]), 200
        return response

    @app.route('/notes/<id>', methods=['GET'])
    def get_note(id):
        note = Note.query.get_or_404(id)
        return jsonify(note.to_dict()), 200

    @app.route('/notes', methods=['POST'])
    def create_note():
        data = request.get_json()
        if not data or 'title' not in data or 'body' not in data:
            return jsonify({"status": "error", "message": "Missing required data"}), 400
        tags = ','.join(data.get('tags', []))
        note = Note(title=data['title'], tags=tags, body=data['body'])
        db.session.add(note)
        db.session.commit()
        return jsonify({"status": "success", "message": "Note created", "data": {"noteId": note.id}}), 201

    @app.route('/notes/<id>', methods=['PUT'])
    def update_note(id):
        note = Note.query.get_or_404(id)
        data = request.get_json()
        if 'title' in data:
            note.title = data['title']
        if 'tags' in data:
            note.tags = ','.join(data['tags'])
        if 'body' in data:
            note.body = data['body']
        db.session.commit()
        return jsonify({"status": "success", "message": "Note updated", "data": note.to_dict()}), 200

    @app.route('/notes/<id>', methods=['DELETE'])
    def delete_note(id):
        note = Note.query.get_or_404(id)
        db.session.delete(note)
        db.session.commit()
        return jsonify({"status": "success", "message": "Note deleted"}), 200

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
