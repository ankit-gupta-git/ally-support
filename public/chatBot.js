(function () {
    const scriptTag = document.currentScript;
    const ownerId = scriptTag.getAttribute("data-owner-id");
    // Use the base URL from the script src or default to localhost
    const scriptSrc = new URL(scriptTag.src);
    const baseUrl = scriptSrc.origin;
    const api_url = `${baseUrl}/api/chat`;

    if (!ownerId) {
        console.error("Missing ownerId");
        return;
    }

    // Create Chat Button
    const button = document.createElement("div");
    button.innerHTML = "🗨️";
    Object.assign(button.style, {
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "56px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        cursor: "pointer",
        color: "#fff",
        background: "#000",
        borderRadius: "50%",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        zIndex: "9999",
        transition: "transform 0.2s"
    });
    
    button.onmouseover = () => button.style.transform = "scale(1.05)";
    button.onmouseout = () => button.style.transform = "scale(1)";
    document.body.appendChild(button);

    // Create Chat Box
    const box = document.createElement("div");
    Object.assign(box.style, {
        position: "fixed",
        bottom: "90px",
        right: "24px",
        width: "350px",
        height: "500px",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        display: "none",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: "9999",
        border: "1px solid #e5e5e5",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    });

    box.innerHTML = `
        <div style="background: #000; color: #fff; padding: 16px; display: flex; align-items: center; justify-content: space-between;">
            <div style="font-weight: 600; font-size: 16px;">Customer Support</div>
            <div id="close-btn" style="cursor: pointer; padding: 4px;">✕</div>
        </div>

        <div id="chat-messages" style="flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; background: #f9fafb;">
            <div style="background: #e5e7eb; color: #111; padding: 10px 14px; border-radius: 12px; max-width: 80%; align-self: flex-start; font-size: 14px;">
                Hi there! 👋 How can I help you today?
            </div>
        </div>

        <div style="padding: 16px; background: #fff; border-top: 1px solid #eee;">
            <div style="display: flex; gap: 8px; align-items: center;">
                <input type="text" id="user-input" placeholder="Type a message..." style="flex: 1; padding: 10px 14px; border: 1px solid #e5e5e5; border-radius: 99px; outline: none; font-size: 14px; transition: border-color 0.2s;">
                <button id="send-btn" style="background: #000; color: #fff; border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(box);

    // Elements
    const closeBtn = box.querySelector("#close-btn");
    const messagesDiv = box.querySelector("#chat-messages");
    const input = box.querySelector("#user-input");
    const sendBtn = box.querySelector("#send-btn");

    // Toggle Chat
    button.onclick = () => {
        if (box.style.display === "none") {
            box.style.display = "flex";
            button.style.display = "none";
            // Focus input when opening
            setTimeout(() => input.focus(), 100);
        } else {
            box.style.display = "none";
            button.style.display = "flex";
        }
    };

    closeBtn.onclick = () => {
        box.style.display = "none";
        button.style.display = "flex";
    };

    // Add Message Function
    function addMessage(text, sender) {
        const div = document.createElement("div");
        div.textContent = text;
        Object.assign(div.style, {
            padding: "10px 14px",
            borderRadius: "12px",
            maxWidth: "80%",
            fontSize: "14px",
            lineHeight: "1.5",
            alignSelf: sender === "user" ? "flex-end" : "flex-start",
            background: sender === "user" ? "#000" : "#e5e7eb",
            color: sender === "user" ? "#fff" : "#111",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
        });
        messagesDiv.appendChild(div);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Send Message Logic
    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, "user");
        input.value = "";
        
        // Typing indicator
        const typingDiv = document.createElement("div");
        typingDiv.innerHTML = '<span style="animation: pulse 1s infinite;">...</span>';
        Object.assign(typingDiv.style, {
            padding: "8px 14px",
            borderRadius: "12px",
            background: "#e5e7eb",
            color: "#666",
            alignSelf: "flex-start",
            fontSize: "12px",
            marginTop: "4px"
        });
        messagesDiv.appendChild(typingDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        try {
            const res = await fetch(api_url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, ownerId })
            });

            const data = await res.json();
            messagesDiv.removeChild(typingDiv);
            
            if (data.error) {
                 addMessage("Something went wrong. Please try again.", "bot");
            } else {
                addMessage(data.reply || data.response || data, "bot"); 
            }
            
        } catch (err) {
            console.error(err);
            if(typingDiv.parentNode === messagesDiv) {
                messagesDiv.removeChild(typingDiv);
            }
            addMessage("Sorry, I'm having trouble connecting right now.", "bot");
        }
    }

    sendBtn.onclick = sendMessage;
    
    input.onkeypress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };
    
    // Add typing animation style
    const style = document.createElement("style");
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 0.4; }
            50% { opacity: 1; }
            100% { opacity: 0.4; }
        }
    `;
    document.head.appendChild(style);

})();