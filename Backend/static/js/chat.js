// chat.js - Handles chat interactions and UI updates
let conversationId = null;
let isLoading = false;

// DOM elements
const messagesList = document.getElementById("messages-list");
const messagesWrapper = document.getElementById("messages-wrapper");
const emptyState = document.getElementById("empty-state");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const newChatBtn = document.getElementById("new-chat-btn");

// Scroll messages container to the bottom after each update
function scrollMessagesToBottom() {
    if (!messagesWrapper) return;
    requestAnimationFrame(() => {
        messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
    });
}

// Initialize a new conversation by requesting an ID from the server
async function initConversation() {
    const res = await fetch("/api/conversation/new", { method: "POST" });
    const data = await res.json();

    conversationId = data.conversation_id;
    messagesList.innerHTML = "";
    messagesList.style.display = "none";
    emptyState.style.display = "flex";
}

// Render a single message bubble in the chat area
function showMessage(role, content) {
    emptyState.style.display = "none";
    messagesList.style.display = "flex";

    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${role}`;

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = content;
    msgDiv.appendChild(bubble);
    messagesList.appendChild(msgDiv);
    scrollMessagesToBottom();
}

// Show animated typing indicator while waiting for the assistant response
function showTyping() {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message assistant";
    msgDiv.id = "typing-indicator";

    const bubble = document.createElement("div");
    bubble.className = "message-bubble typing";
    bubble.innerHTML = "<span></span><span></span><span></span>";

    msgDiv.appendChild(bubble);
    messagesList.appendChild(msgDiv);
    messagesList.style.display = "flex";
    emptyState.style.display = "none";
    scrollMessagesToBottom();
}

// Remove typing indicator once the assistant response has arrived
function removeTyping() {
    const indicator = document.getElementById("typing-indicator");
    if (indicator) {
        indicator.remove();
        scrollMessagesToBottom();
    }
}

// Send the user message to the backend and display the assistant reply
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || isLoading || !conversationId) return;

    chatInput.value = "";
    isLoading = true;
    sendBtn.disabled = true;

    showMessage("user", text);
    showTyping();

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conversation_id: conversationId, message: text }),
        });

        const data = await res.json();
        removeTyping();
        if (data.reply) {
            showMessage("assistant", data.reply);
        } else {
            showMessage("assistant", "⚠️ Error: Could not get a response.");
        }
    } catch (e) {
        removeTyping();
        showMessage("assistant", "⚠️ Network error. Please try again.");
    } finally {
        isLoading = false;
        sendBtn.disabled = false;
        chatInput.focus();
    }
}

// Send on button click
sendBtn.addEventListener("click", sendMessage);

// Send on Enter key; Shift+Enter inserts a new line
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Reset and start a fresh conversation
newChatBtn.addEventListener("click", initConversation);

// Auto-resize textarea as the user types, capped at 140px
chatInput.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = Math.min(chatInput.scrollHeight, 140) + "px";
});

// Kick off the first conversation on page load
initConversation();
