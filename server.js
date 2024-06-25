const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const cron = require("node-cron");
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname)));

app.get("/api/jobs", (req, res) => {
  fs.readFile("Beans/job_listings.json", (err, data) => {
    if (err) {
      console.error("Error reading job listings file:", err);
      res.status(500).send("Error reading job listings file.");
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  });
});

app.get("/api/scraping-log", (req, res) => {
  fs.readFile("Beans/scraping_log.json", (err, data) => {
    if (err) {
      console.error("Error reading scraping log file:", err);
      res.status(500).send("Error reading scraping log file.");
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

cron.schedule("0 0 * * *", () => {
  console.log("Running scraper...Motherfuckerrrrr good shit");
  exec("python scraper.py", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing scraper: ${error}`);
      return;
    }
    console.log(`Scraper output: ${stdout}`);
    if (stderr) {
      console.error(`Scraper error output: ${stderr}`);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
