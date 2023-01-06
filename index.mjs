import config from "./config/config.mjs";
import amqp from "amqplib";
import express from "express";
import Router from "express-promise-router";
import { query } from "./db/index.mjs";

/* =================
   SERVER SETUP
================== */
const router = Router();
const app = express();
const port = config.get("port");

app.use(express.json());
app.use(router);

main()
  .catch((err) => console.log(err));

/* ======
   ROUTES
========*/
router.get("/health", (_req, res) => {
  res.sendStatus(200);
});

async function main() {
  /* ======================
     START RABBIT CONSUMER
  =========================*/
  const conn = await amqp.connect(`amqp://guest:guest@${config.get("amqphost")}:${config.get("amqpport")}`);
  const queue = "chat_queue";

  const ch1 = await conn.createChannel();
  await ch1.assertQueue(queue);

  /* ======================
     START HANDLE MESSAGES
  =========================*/
  ch1.consume(queue, async (msg) => {
    if (msg !== null) {
      switch (msg.properties.type) {
        case "new_message":
          await handleNewMessageEvent(msg.content.toString());
          break;
        
        default:
          console.log(`Message with unhandled \`type\` received: ${msg.properties.type}. Ignoring...`)
      }

      ch1.ack(msg);
    } else {
      console.log("Consumer cancelled by server");
    }
  });
}

/* ================================
   INDIVIDUAL MESSAGE TYPE HANDLERS
==================================*/
async function handleNewMessageEvent(messageContent) {
  console.log("Received new_message: ", messageContent);
  const msg = JSON.parse(messageContent);
  const { rows: preferences } = await query("SELECT * FROM notification_preferences WHERE user_id = $1", [msg.user_id]);
  
  if (!preferences) {
    console.log("No notification preferences defined for user with id ${msg.user_id}. No notifications sent for message.");
    return;
  }
  for (let pref of preferences) {
    console.log(`Sending notification of new message via ${pref.address_type} to ${pref.address}`);
  }
}

/* =================
   SERVER START
================== */
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

export default app;
