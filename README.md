# GPTchat Clone

A simple ChatGPT-style web app built with Flask (MPA), MongoDB, and the OpenAI API.

## Features
- Main chat page
- About page
- New conversation with conversation_id
- Message history saved in MongoDB
- Full conversation context sent to the model

## Tech Stack
- Python + Flask
- MongoDB + PyMongo
- OpenAI API
- HTML/CSS/JS

## Quick Run
1. Open the project folder and activate your virtual environment.
2. Install dependencies:

```bash
pip install -r Backend/requirements.txt
```

3. Create a .env file inside Backend/ with:

```env
OPENAI_API_KEY=your_key_here
MONGO_URI=mongodb://localhost:27017/chatgpt_clone
SECRET_KEY=dev-secret-key
```

4. Run the server:

```bash
python Backend/app.py
```

5. Open in browser:

```text
http://localhost:5000
```

## Project Structure
- Backend/app.py - app routes and server logic
- Backend/templates/ - HTML pages
- Backend/static/ - CSS and JS files
- Database/setup.js - database setup script
