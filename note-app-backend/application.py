import uuid
from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event, func
from flask_migrate import Migrate
from datetime import datetime, timedelta
from dateutil.parser import parse
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
        body = db.Column(db.String(500), nullable=False)
        created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
        updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

        def to_dict(self):
            category = Category.query.get(self.category_id)
            return {
                'type': 'note',
                'id': self.id,
                'category_id': self.category_id,
                'category_color': category.color if category else None,
                'title': self.title,
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
        completed_at = db.Column(db.DateTime, default=None)
        updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

        def to_dict(self):
            category = Category.query.get(self.category_id)
            return {
                'type': 'task',
                'id': self.id,
                'category_id': self.category_id,
                'category_color': category.color if category else None,
                'title': self.title,
                'description': self.description,
                'status': self.status,
                'weight': self.weight,
                'progress': self.progress,
                'created_at': self.created_at,
                'completed_at': self.completed_at,
                'updated_at': self.updated_at
            }

    class JournalEntry(db.Model):
        __tablename__ = 'journalentry'
        __table_args__ = {'extend_existing': True}
        id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
        category_id = db.Column(db.String(36), db.ForeignKey('category.id'))
        title = db.Column(db.String(120), nullable=False)
        body = db.Column(db.String(500), nullable=False)
        date = db.Column(db.Date, nullable=True)
        created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
        updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

        def to_dict(self):
            category = Category.query.get(self.category_id)
            return {
                'type': 'journal',
                'id': self.id,
                'category_id': self.category_id,
                'category_color': category.color if category else None,
                'title': self.title,
                'body': self.body,
                'date': self.date,
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
        search_term = request.args.get('search')
        if category_id:
            if search_term:
                notes = Note.query.filter(Note.category_id == category_id, Note.title.contains(search_term)).all()
            else:
                notes = Note.query.filter_by(category_id=category_id).all()
        else:
            if search_term:
                notes = Note.query.filter(Note.title.contains(search_term)).all()
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
        note = Note(title=data['title'], body=data['body'], category_id=data['category_id'])
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
        search_term = request.args.get('search')
        if category_id:
            if search_term:
                tasks = Task.query.filter(Task.category_id == category_id, Task.title.contains(search_term)).all()
            else:
                tasks = Task.query.filter_by(category_id=category_id).all()
        else:
            if search_term:
                tasks = Task.query.filter(Task.title.contains(search_term)).all()
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

    @event.listens_for(Task.progress, 'set', retval=True)
    def update_status(task, value, oldvalue, initiator):
        if value == 100 and task.status != 'Completed':
            task.status = 'Completed'
            task.completed_at = datetime.utcnow()
        elif value > 0:
            task.status = 'In Progress'
        else:
            task.status = 'Not Started'
        return value

    @app.route('/journal_entries', methods=['GET'])
    def get_journal_entries():
        category_id = request.args.get('category_id')
        search_term = request.args.get('search')
        if category_id:
            if search_term:
                entries = JournalEntry.query.filter(JournalEntry.category_id == category_id, JournalEntry.title.contains(search_term)).all()
            else:
                entries = JournalEntry.query.filter_by(category_id=category_id).all()
        else:
            if search_term:
                entries = JournalEntry.query.filter(JournalEntry.title.contains(search_term)).all()
            else:
                entries = JournalEntry.query.all()
        response = jsonify([entry.to_dict() for entry in entries]), 200
        return response

    @app.route('/journal_entries/<id>', methods=['GET'])
    def get_journal_entry(id):
        entry = JournalEntry.query.get_or_404(id)
        return jsonify(entry.to_dict()), 200

    @app.route('/journal_entries', methods=['POST'])
    def create_journal_entry():
        data = request.get_json()
        if not data or 'title' not in data or 'body' not in data or 'category_id' not in data or 'date' not in data:
            return jsonify({"status": "error", "message": "Missing required data"}), 400
        entry = JournalEntry(title=data['title'], body=data['body'], category_id=data['category_id'], date=data['date'])
        db.session.add(entry)
        db.session.commit()
        return jsonify({"status": "success", "message": "Journal entry created", "data": {"entryId": entry.id}}), 201

    @app.route('/journal_entries/<id>', methods=['PUT'])
    def update_journal_entry(id):
        entry = JournalEntry.query.get_or_404(id)
        data = request.get_json()
        if 'title' in data:
            entry.title = data['title']
        if 'category_id' in data:
            entry.category_id = data['category_id']
        if 'body' in data:
            entry.body = data['body']
        if 'date' in data:
            entry.date = parse(data['date'])
        db.session.commit()
        return jsonify({"status": "success", "message": "Journal entry updated", "data": entry.to_dict()}), 200

    @app.route('/journal_entries/<id>', methods=['DELETE'])
    def delete_journal_entry(id):
        entry = JournalEntry.query.get_or_404(id)
        db.session.delete(entry)
        db.session.commit()
        return jsonify({"status": "success", "message": "Journal entry deleted"}), 200

    @app.route('/analytics', methods=['GET'])
    def get_analytics():
        analytics = {}
        
        # Total count of tasks, notes, journal entries, and categories.
        analytics['total_tasks'] = Task.query.count()
        analytics['total_notes'] = Note.query.count()
        analytics['total_journal_entries'] = JournalEntry.query.count()
        analytics['total_categories'] = Category.query.count()
        
        # Total count of completed tasks
        analytics['completed_tasks'] = Task.query.filter_by(status='Completed').count()

        # Average task progress
        average_progress = db.session.query(func.avg(Task.progress)).scalar()
        analytics['average_task_progress'] = round(average_progress, 2) if average_progress else 0

        # Number of tasks created in the last 7 days
        one_week_ago = datetime.now() - timedelta(days=7)
        analytics['recent_tasks'] = Task.query.filter(Task.created_at >= one_week_ago).count()

        # Number of notes created in the last 7 days
        analytics['recent_notes'] = Note.query.filter(Note.created_at >= one_week_ago).count()

        # Number of journal entries created in the last 7 days
        analytics['recent_journal_entries'] = JournalEntry.query.filter(JournalEntry.created_at >= one_week_ago).count()

        # The most used category
        most_used_category = db.session.query(Task.category_id, func.count(Task.category_id)).group_by(Task.category_id).order_by(func.count(Task.category_id).desc()).first()
        if most_used_category:
            most_used_category = Category.query.get(most_used_category[0])
            analytics['most_used_category'] = most_used_category.to_dict() if most_used_category else None
        
        # The category with the most completed tasks
        most_completed_tasks_category = db.session.query(Task.category_id, func.count(Task.category_id)).filter_by(status='Completed').group_by(Task.category_id).order_by(func.count(Task.category_id).desc()).first()
        if most_completed_tasks_category:
            most_completed_tasks_category = Category.query.get(most_completed_tasks_category[0])
            analytics['most_completed_tasks_category'] = most_completed_tasks_category.to_dict() if most_completed_tasks_category else None

        # The category with the highest average task progress
        highest_avg_task_progress_category = db.session.query(Task.category_id, func.avg(Task.progress)).group_by(Task.category_id).order_by(func.avg(Task.progress).desc()).first()
        if highest_avg_task_progress_category:
            highest_avg_task_progress_category = Category.query.get(highest_avg_task_progress_category[0])
            analytics['highest_avg_task_progress_category'] = highest_avg_task_progress_category.to_dict() if highest_avg_task_progress_category else None

        # Completed tasks for each day in the past 30 days
        completed_tasks_trend = db.session.query(
            func.date(Task.completed_at).label('date'), 
            func.count(Task.id).label('completed_count')
        ).filter(
            Task.status=='Completed', 
            Task.completed_at>=datetime.now()-timedelta(days=30)
        ).group_by(
            'date'
        ).all()

        analytics['task_completion_trend'] = [{'date': record.date, 'completed_count': record.completed_count} for record in completed_tasks_trend]

        return jsonify(analytics), 200


    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
