import uuid
from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, support_credentials=True) 
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

    db.init_app(app)
    migrate.init_app(app, db)

    class Category(db.Model):
        __tablename__ = 'category'
        __table_args__ = {'extend_existing': True}
        id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
        name = db.Column(db.String(50), nullable=False)
        color = db.Column(db.String(20), nullable=False)

        def to_dict(self):
            return {
                'id': self.id,
                'name': self.name,
                'color': self.color,
            }

    class Note(db.Model):
        __tablename__ = 'note'
        __table_args__ = {'extend_existing': True}
        id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
        category_id = db.Column(db.String(36), db.ForeignKey('category.id'))
        title = db.Column(db.String(120), nullable=False)
        tags = db.Column(db.String(120), nullable=True)
        body = db.Column(db.String(500), nullable=False)
        created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
        updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

        def to_dict(self):
            return {
                'id': self.id,
                'category_id': self.category_id,
                'title': self.title,
                'tags': self.tags.split(",") if self.tags else [],
                'body': self.body,
                'created_at': self.created_at,
                'updated_at': self.updated_at
            }

    class Task(db.Model):
        __tablename__ = 'task'
        __table_args__ = {'extend_existing': True} 
        id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
        category_id = db.Column(db.String(36), db.ForeignKey('category.id'))
        title = db.Column(db.String(120), nullable=False)
        description = db.Column(db.String(500), nullable=True)
        status = db.Column(db.String(120), nullable=False, default="Not Started")
        weight = db.Column(db.Integer, nullable=False, default=1)
        progress = db.Column(db.Integer, nullable=False, default=0)
        created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
        updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

        def to_dict(self):
            return {
                'id': self.id,
                'category_id': self.category_id,
                'title': self.title,
                'description': self.description,
                'status': self.status,
                'weight': self.weight,
                'progress': self.progress,
                'created_at': self.created_at,
                'updated_at': self.updated_at
            }


    @app.route('/')
    def home():
        return render_template('index.html')

    @app.route('/categories', methods=['GET'])
    def get_categories():
        categories = Category.query.all()
        response = jsonify([category.to_dict() for category in categories]), 200
        return response

    @app.route('/categories/<id>', methods=['GET'])
    def get_category(id):
        category = Category.query.get_or_404(id)
        return jsonify(category.to_dict()), 200

    @app.route('/categories', methods=['POST'])
    def create_category():
        data = request.get_json()
        if not data or 'name' not in data or 'color' not in data:
            return jsonify({"status": "error", "message": "Missing required data"}), 400
        category = Category(name=data['name'], color=data['color'])
        db.session.add(category)
        db.session.commit()
        return jsonify({"status": "success", "message": "Category created", "data": category.to_dict()}), 201

    @app.route('/categories/<id>', methods=['PUT'])
    def update_category(id):
        category = Category.query.get_or_404(id)
        data = request.get_json()
        if 'name' in data:
            category.name = data['name']
        if 'color' in data:
            category.color = data['color']
        db.session.commit()
        return jsonify({"status": "success", "message": "Category updated", "data": category.to_dict()}), 200

    @app.route('/categories/<id>', methods=['DELETE'])
    def delete_category(id):
        category = Category.query.get_or_404(id)
        db.session.delete(category)
        db.session.commit()
        return jsonify({"status": "success", "message": "Category deleted"}), 200

    @app.route('/notes', methods=['GET'])
    def get_notes():
        category_id = request.args.get('category_id')
        if category_id:
            notes = Note.query.filter_by(category_id=category_id).all()
        else:
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
        if not data or 'title' not in data or 'body' not in data or 'category_id' not in data:
            return jsonify({"status": "error", "message": "Missing required data"}), 400
        tags = ','.join(data.get('tags', []))
        note = Note(title=data['title'], tags=tags, body=data['body'], category_id=data['category_id'])
        db.session.add(note)
        db.session.commit()
        return jsonify({"status": "success", "message": "Note created", "data": {"noteId": note.id}}), 201

    @app.route('/notes/<id>', methods=['PUT'])
    def update_note(id):
        note = Note.query.get_or_404(id)
        data = request.get_json()
        if 'title' in data:
            note.title = data['title']
        if 'category_id' in  data:
            note.category_id = data['category_id']
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

    @app.route('/tasks', methods=['GET'])
    def get_tasks():
        category_id = request.args.get('category_id')
        if category_id:
            tasks = Task.query.filter_by(category_id=category_id).all()
        else:
            tasks = Task.query.all()
        response = jsonify([task.to_dict() for task in tasks]), 200
        return response


    @app.route('/tasks/<id>', methods=['GET'])
    def get_task(id):
        task = Task.query.get_or_404(id)
        return jsonify(task.to_dict()), 200

    @app.route('/tasks', methods=['POST'])
    def create_task():
        data = request.get_json()
        if not data or 'title' not in data or 'description' not in data or 'category_id' not in data:
            return jsonify({"status": "error", "message": "Missing required data"}), 400
        task = Task(title=data['title'], description=data['description'], category_id=data['category_id'], status=data.get('status', 'Not Started'), weight=data.get('weight', 1))
        db.session.add(task)
        db.session.commit()
        return jsonify({"status": "success", "message": "Task created", "data": {"taskId": task.id}}), 201

    @app.route('/tasks/<id>', methods=['PUT'])
    def update_task(id):
        task = Task.query.get_or_404(id)
        data = request.get_json()
        if 'title' in data:
            task.title = data['title']
        if 'description' in data:
            task.description = data['description']
        if 'category_id' in data:
            task.category = data['category_id']
        if 'status' in data:
            task.status = data['status']
        if 'weight' in data:
            task.weight = data['weight']
        if 'progress' in data:
            task.progress = data['progress']
        db.session.commit()
        return jsonify({"status": "success", "message": "Task updated", "data": task.to_dict()}), 200

    @app.route('/tasks/<id>', methods=['DELETE'])
    def delete_task(id):
        task = Task.query.get_or_404(id)
        db.session.delete(task)
        db.session.commit()
        return jsonify({"status": "success", "message": "Task deleted"}), 200


    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
