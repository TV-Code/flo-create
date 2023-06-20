from flask import current_app

# Import the database object (db) from where it is defined in your project
# Import the create_app function or app instance from where it is defined in your project

from application import db, create_app

# Create an app context
app = create_app()  # If you have an app factory function like create_app
# app = your_app_instance  # If you have a direct app instance

with app.app_context():
    # The SQL command to delete the specific version number from alembic_version table
    sql_command = "DELETE FROM alembic_version WHERE version_num='8431cc98be41'"

    # Execute the SQL command
    db.engine.execute(sql_command)
