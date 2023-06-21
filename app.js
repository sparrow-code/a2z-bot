const fs = require("fs");
const { Client, LocalAuth } = require("whatsapp-web.js");

const qrcode = require("qrcode-terminal");

const xlsx = require("xlsx");

const workbook = xlsx.readFile("./data.xlsx");

// Get the first sheet
const sheet = workbook.Sheets[workbook.SheetNames[0]];

let validValues = [];

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");

  client.sendMessage("919696227984@c.us", "Bot is Ready");

  // Iterate over the sheet rows
  for (const cellAddress in sheet) {
    // Access the cell value
    const cellValue = sheet[cellAddress].v;
    if (typeof cellValue === "number" && cellValue.toString().length === 10) {
      validValues.push(cellValue);
    }
  }
});

// 919696227984@c.us

client.on("message", (msg) => {
  if (msg.body == "!ping") {
    msg.reply("pong");
  }
  if (msg.body == "!promote") {
    
    // client.sendMessage(`91${validValues[i]}@c.us`, "Hi How Are You");
    msg.reply("Message Have Been Start Promoting 🎉");

    for(let i = 0 ; i === validValues.length ; i++  ) {
      // client.sendMessage("919696227984@c.us", "Bot is Ready");
      client.sendMessage(`91${i}@c.us`, `Hello ,\nYour  properties is still available on rent or sale or looking for buying & rent properties at Mumbai, Navi Mumbai, Kalyan ,Dombiwali ,Thane , Palava City\nCall - 9967078412`);

    }
  }
});

/* client.on('authenticated', (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
      if (err) {
          console.error(err);
      }
  });
}); */

// Start the client
client.initialize();
