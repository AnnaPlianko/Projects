from datetime import datetime
from flask import Flask, render_template, request, jsonify, session
from flask_pymongo import PyMongo
import openai
import os
from dotenv import load_dotenv
import uuid
from typing import Any, cast


# Load environment variables from .env file
load_dotenv()

# Flask app setup
app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")

# MongoDB configuration
app.config["MONGO_URI"] = os.getenv(
    "MONGO_URI", "mongodb://localhost:27017/chatgpt_clone")
mongo: PyMongo = PyMongo(app)

# OpenAI API key configuration
openai.api_key = os.getenv("OPENAI_API_KEY")

# Pages routes


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/about")
def about():
    return render_template("about.html")


# API Routes
@app.route("/api/conversation/new", methods=["POST"])
# Create a new conversation and return its ID
def new_conversation():
    db = cast(Any, mongo.db)
    conversation_id = str(uuid.uuid4())
    db.conversations.insert_one(
        {"_id": conversation_id, "created_at": datetime.now()})

    return jsonify({"conversation_id": conversation_id})


@app.route("/api/chat", methods=["POST"])
# Handle chat messages, save to DB, and get OpenAI response
def chat():
    data = request.get_json()
    conversation_id = data.get("conversation_id")
    user_message = data.get("message", "").strip()
    db = cast(Any, mongo.db)

    if not user_message or not conversation_id:
        return jsonify({"error": "Missing fields"}), 400

    # Save user message to MongoDB
    db.messages.insert_one({
        "conversation_id": conversation_id,
        "role": "user",
        "content": user_message
    })

    # Get full conversation history from DB
    history = list(db.messages.find(
        {"conversation_id": conversation_id},
        {"_id": 0, "role": 1, "content": 1}
    ).sort("_id", 1))

    # Call OpenAI from server side
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=history
        )
        # Extract assistant message from OpenAI response
        assistant_message = response.choices[0].message.content
    except Exception as e:
        return jsonify({"error": f"OpenAI error: {str(e)}"}), 500

    # Save assistant message to MongoDB
    db.messages.insert_one({
        "conversation_id": conversation_id,
        "role": "assistant",
        "content": assistant_message
    })

    return jsonify({"reply": assistant_message})


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=5000)
