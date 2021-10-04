/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Link = require("./models/link");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");
const { restart } = require("nodemon");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.post("/getUrl", async (req, res) => {
  let { short } = req.body;
  try {
    let link = await Link.findOne({ short: short });
    if (link == null) {
      res.status(200).send({ success: false, msg: `No link found with short = ${short}` });
      return;
    }
    res.status(200).send({
      original: link.original,
      probability: link.probability,
      msg: `Success getting ${short}`,
      success: true,
    });
    return;
  } catch (e) {
    res.status(404).send({ msg: `Error getting link for ${short}, error = ${e}` });
    return;
  }
});
//from https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
function isAlphaNumeric(str) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (
      !(code > 47 && code < 58) && // numeric (0-9)
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123)
    ) {
      // lower alpha (a-z)
      return false;
    }
  }
  return true;
}
router.post("/createUrl", async (req, res) => {
  let { short, original, probability } = req.body;
  if (!isAlphaNumeric(short)) {
    res
      .status(200)
      .send({ success: false, msg: "the alias should only containe alphanumeric characters" });
    return;
  }
  let prob = parseFloat(probability);
  if (prob < 0 || prob > 1) {
    res
      .status(200)
      .send({ success: false, msg: "the probability can only be on the range [0, 1]" });
    return;
  }
  try {
    let link = await Link.findOne({ short: short });
    if (link != null) {
      //Uh oh, there is already a link related to this one!
      res
        .status(200)
        .send({ success: false, msg: `There is already a link related to the alias '${short}' ` });
      return;
    }
    //create
    let newLink = new Link({ short, original, probability });
    createdLink = await newLink.save();
    res.send({
      success: true,
      msg: `Successfully linked '${original}' with the alias: ${short}`,
    });
  } catch (e) {
    res.status(404).send({ msg: `Error getting short for ${original}, error = ${e}` });
  }
});
// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
