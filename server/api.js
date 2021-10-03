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
router.post("/createUrl", async (req, res) => {
  let { short, original, probability } = req.body;
  try {
    let link = await Link.findOne({ short: short });
    if (link != null) {
      //Uh oh, there is already a link related to this one!
      res
        .status(200)
        .send({ success: false, msg: `There is already a link related to -> ${short} <-` });
      return;
    }
    //create
    let newLink = new Link({ short, original, probability });
    createdLink = await newLink.save();
    res.send({
      success: true,
      msg: `Successfully linked ${original} with the shorten version: ${short}`,
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
