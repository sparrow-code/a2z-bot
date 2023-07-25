const fs = require("fs");
const { Client, LocalAuth } = require("whatsapp-web.js");

const qrcode = require("qrcode-terminal");

const xlsx = require("xlsx");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// To Load Auth
const client = new Client({
  authStrategy: new LocalAuth(),
});

// To Generate QR Code
client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");

  client.sendMessage("919696227984@c.us", "Bot is Ready");
});

// 919696227984@c.us
client.on("message", async (msg) => {
  if (msg.hasMedia && msg.body && msg.body.includes("!promote")) {
    const media = await msg.downloadMedia();

    try {
      require("fs").writeFileSync(`./${media.filename}`, media.data, {
        encoding: "base64",
      });
      const chat = await client.getChatById(msg.from);
      await chat.sendStateTyping();
      await delay(2000);
      setTimeout(() => {
        msg.reply(`📂 File Downloaded : ${media.filename} 🗄`);
      }, 2000);

      const workbook = xlsx.readFile(`./${media.filename}`);

      // Get the first sheet
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      let validValues = [];

      // Iterate over the sheet rows
      for (const cellAddress in sheet) {
        // Access the cell value
        const cellValue = sheet[cellAddress].v;
        if (
          typeof cellValue === "number" &&
          cellValue.toString().length === 10
        ) {
          validValues.push(cellValue);
        }
      }

      await chat.sendStateTyping();
      await delay(2000);
      msg.reply(`Total 📱 Mobile Number Found : ${validValues.length}`);

      await chat.sendStateTyping();
      await delay(2000);
      msg.reply("ℹ Data Be Start 🟢 Promoting 🗣");

      await chat.sendStateTyping();
      await delay(2000);
      msg.reply("🔊 Promoting Started 🎁 ");

      let promoContentMatch = msg.body.match(/\[([\s\S]*?)\]/);
      let promoTimeMatch = msg.body.match(/(\d+)([smh])/);

      console.log(msg.body);

      console.log(promoContentMatch + " " + promoTimeMatch)

      if (promoContentMatch && promoTimeMatch) {
        let promoContent = promoContentMatch[1];
        let promoTimeValue = parseInt(promoTimeMatch[1]);
        let promoTimeUnit = promoTimeMatch[2];
    
        let promoTime = {
          s: promoTimeValue * 1000,
          m: promoTimeValue * 60 * 1000,
          h: promoTimeValue * 60 * 60 * 1000,
        }[promoTimeUnit];
    
        let promoData = {
          content: promoContent,
          time: promoTime,
        };
    
        console.log(promoData)
    
        for (let i = 0; i < validValues.length; i++) {
          const chat = await client.getChatById(
            "91" + validValues[i] + "@c.us"
          );
          await chat.sendStateTyping();
          setTimeout(() => {
            client.sendMessage(
              "91" + validValues[i] + "@c.us",
              `${promoData.content}`
            );
          }, promoData.time * i);
        }
      }
    

      await chat.sendStateTyping();
      await delay(2000);
      setTimeout(() => {
        msg.reply("🎉 Promoting Done ✅");
        require("fs").unlinkSync(`./${media.filename}`);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  }

  if (msg.body == "!ping") {
    msg.reply("pong");
  }
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
  client.sendMessage("919696227984@c.us", "🤖 Bot is Disconnect 📵");
  client.initialize();
});

// Start the client
client.initialize();
