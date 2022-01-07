const { readFileSync, writeFileSync, existsSync } = require("fs");
const { join } = require("path");
const ms = require("ms");

// Initialize logger file
if (!existsSync(join("./log.json")))
    writeFileSync(
        join("./log.json"),
        JSON.stringify({ lastOnline: Date.now(), lastChecked: Date.now(), ranges: [] })
    );
let log = JSON.parse(readFileSync(join("./log.json")));
log.lastOnline = Date.now();

// Check every minute for outage
setInterval(() => {
    let now = Date.now();
    let last = new Date(log.lastChecked);

    if (now - last > ms("90s")) {
        // Outage!
        log.ranges.unshift([+last, now]);
    }

    log.lastChecked = now;
    writeFileSync(join("./log.json"), JSON.stringify(log));
}, ms("1m"));
