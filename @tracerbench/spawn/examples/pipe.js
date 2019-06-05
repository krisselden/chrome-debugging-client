const spawn = require("@tracerbench/spawn").default;
const findChrome = require("@tracerbench/find-chrome").default;
const { inspect } = require("util");

const chrome = spawn(
  findChrome(),
  ["--remote-debugging-pipe"],
  "inherit",
  "pipe",
);

const send = chrome.attach(
  message => {
    console.log(inspect(JSON.parse(message)));
  },
  err => {
    if (err) {
      console.log(err.stack);
    }
    console.log("close");
  },
);

let seq = 0;

send(
  JSON.stringify({
    id: ++seq,
    method: "Target.setDiscoverTargets",
    params: {
      discover: true,
    },
  }),
);

setTimeout(async () => {
  send(
    JSON.stringify({
      id: ++seq,
      method: "Browser.close",
    }),
  );

  await chrome.waitForExit();
}, 1000);
