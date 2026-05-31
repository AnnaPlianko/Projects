// Connect to the chatgpt_clone database (creates it if it does not exist)
db = db.getSiblingDB("chatgpt_clone");

// Create the messages collection
db.createCollection("messages");

// Index for fast lookup of all messages in a conversation
db.messages.createIndex({ conversation_id: 1 });

// Compound index for retrieving messages in chronological order within a conversation
db.messages.createIndex({ conversation_id: 1, _id: 1 });

print("Database setup complete!");
