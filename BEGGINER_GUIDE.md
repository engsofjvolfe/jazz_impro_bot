# 🎹 Jazz Impro Bot – Beginner Guide

This is a simple step-by-step guide for people **who have never used programming tools** but want to run the Jazz Impro Bot on their computer and use it with Telegram.

> ✅ You don’t need to pay anything. You’ll only run it on your own computer.

---

## 🟢 Step 1 – Create Your Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather).
2. Click **Start** or type `/start`.
3. Type `/newbot` and follow the instructions.
4. Choose a name and a username for your bot (example: `MyJazzBot`).
5. At the end, you will receive a **token**, like this:

   ```
   123456789:ABCDefghIJKlmnoPQRstuVWxyz
   ```

   Save this token. You will need it soon.

---

## 🟡 Step 2 – Download the Bot Code

1. Go to the GitHub page of the project (ask the author if you don’t have the link).
2. Click the green **“Code”** button.
3. Choose **“Download ZIP”**.
4. Unzip the file somewhere on your computer (e.g. Desktop).

---

## 🔵 Step 3 – Install Node.js

1. Visit [https://nodejs.org](https://nodejs.org).
2. Download the **Recommended** version (LTS).
3. Install it (just click Next/Next/Finish).

---

## 🟣 Step 4 – Run the Bot

1. Open the folder you unzipped earlier.

2. Right-click inside the folder and select:

   * **“Open Terminal”**, or
   * **“Open PowerShell window here”**

3. In the terminal window, type:

   ```bash
   npm install
   ```

   Wait until it finishes (it may take a minute).

4. Create a new file in the same folder called `.env`

5. Open it and paste this (replace `your_token_here`):

   ```env
   TELEGRAM_TOKEN=your_token_here
   ```

6. Now, to start the bot, type:

   ```bash
   npm start
   ```

You should see a message like:

```
Bot is running...
```

---

## 🟤 Step 5 – Use the Bot in Telegram

1. Open Telegram and find your bot (with the name you gave in Step 1).
2. Click **Start** or type `/start`.
3. Follow the buttons to choose a root note, chord type, and accidental.
4. The bot will suggest a chord for improvisation!

---

## ⚠️ Notes

* The bot works only while the terminal window is open.
* If you close the window, the bot stops.
* To start it again later:

  1. Open the folder again
  2. Open terminal
  3. Run `npm start`

---

## ✅ Summary

* You don’t need to be a programmer.
* You don’t need to upload anything online.
* Just follow these 5 steps to run your own music bot!

Have fun improvising! 🎶
