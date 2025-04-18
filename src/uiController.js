// Controller function for UI elements. 
export function setMessage(text) {
    console.log("ye")
    const messageBox = document.getElementById("messageBox");
    if (messageBox) messageBox.textContent = text;
  }