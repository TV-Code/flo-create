from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
        }

class Task(db.Model):
        id = db.Column(db.String, primary_key=True)
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
                'title': self.title,
                'description': self.description,
                'status': self.status,
                'weight': self.weight,
                'progress': self.progress,
                'created_at': self.created_at,
                'updated_at': self.updated_at
            }