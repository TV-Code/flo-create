# Flo-Create: Productivity Simplified

Flo-Create is a productivity application designed to streamline your day-to-day tasks, notes, and journal entries. It provides a user-friendly platform to manage your personal or work-related activities with ease. Whether you want to jot down a quick note, keep a detailed journal, or manage your tasks efficiently, Flo-Create has got you covered.

## Features

- Create, view, edit, and delete tasks to manage your to-do list effectively.
- Organize your thoughts and notes, and access them easily whenever needed.
- Maintain a personal journal with the ability to look back on past entries.
- Categorize tasks, notes, and journal entries with customizable categories.
- Full-featured user interface with responsive design for all devices.

## Tech Stack

### Frontend

- React
- JavaScript
- HTML/CSS
- MUI (Material UI)

### Backend

- Python with Flask
- Flask-CORS for cross-origin resource sharing
- Flask-SQLAlchemy for database interactions
- Alembic for database migrations

## Installation

### Frontend

```bash
# Clone the repository
git clone https://github.com/TVlearns/flo-create

# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start

### Backend

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment (optional, but recommended)
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies from the requirements.txt file
pip install -r requirements.txt

# If using Conda, create a new environment based on the environment.txt file
conda create --name flo-create-env --file environment.txt

# Activate the Conda environment
conda activate flo-create-env

# Run the Flask server
flask run

## Usage

Add new tasks, notes, or journal entries using the intuitive UI.
Click on any existing item to view or edit details.
Use the category manager to organize your items into categories.
Access your data from any device with a web browser.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.