const ownerId = "usr_111747865323243272"; // Using the ownerId from your previous index.html
const message = "Hello, what is your return policy?";

async function testChat() {
  console.log("Testing Chat API...");
  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        ownerId
      })
    });

    const data = await response.json();
    if (!response.ok) {
        console.error("Server Error Response:", JSON.stringify(data, null, 2));
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Response from server:");
    console.log(JSON.stringify(data, null, 2));

  } catch (error) {
    console.error("Test failed:", error);
  }
}

testChat();
