const express = require("express");
const path = require("path");
const boom = require("boom");
const { ObjectId } = require("mongodb");

const Events = require("../models/Events");
const Users = require("../models/Users");
const Medias = require("../models/Medias");

const router = express.Router();

router.get("/", (req, res) => res.sendFile(path.resolve("./static/index.html")));
router.get("/events/", (req, res) => res.sendFile(path.resolve("./static/events.html")));
router.get("/events/:id", (req, res) => res.sendFile(path.resolve("./static/event.html")));
router.get("/news/:id", (req, res) => res.sendFile(path.resolve("./static/index.html")));
router.get("/add-event/", (req, res) => res.sendFile(path.resolve("./static/add-event.html")));
router.get("/sign-in/", (req, res) => res.sendFile(path.resolve("./static/signin.html")));
router.get("/sign-up/", (req, res) => res.sendFile(path.resolve("./static/signup.html")));
router.get("/location/", (req, res) => res.sendFile(path.resolve("./static/location.html")));
router.get("/rating/", (req, res) => res.sendFile(path.resolve("./static/media.html")));
router.get("/add-event/", (req, res) => res.sendFile(path.resolve("./static/add-event.html")));

router.get("/events-list/", async (req, res) => res.send(await Events.getEvents()));

router.post("/sign-up", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send(boom.badRequest());
  }

  res.send(await Users.register({ email, password }));
});

router.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send(boom.badRequest());
  }

  res.send(await Users.signin(email, password));
});

router.post("/event/:eventId", async (req, res) => {
  const { token } = req.body;
  const { eventId } = req.params;

  try {
    const user = await Users.getUser({ token });
    const event = await Events.getEvent({ _id: ObjectId(eventId) });

    event.sources.forEach(source => {
      let truthRate = 0;
      let biasRate = 0;
      let canVote = true;

      source.comments.forEach(comment => {
        truthRate += parseInt(comment.truth);
        biasRate += parseInt(comment.bias);
        if (user && comment.user === user.email) {
          canVote = false;
        }
      });

      source.canVote = canVote;
      source.truth = truthRate / source.comments.length || "";
      source.bias = biasRate / source.comments.length || "";
    });

    return res.json(event);
  } catch (error) {
    return res.json(boom.badRequest());
  }
});

router.post("/event-rate", async (req, res) => {
  const { token, bias, text, truth, eventId, sourceId } = req.body;
  const user = await Users.getUser({ token });

  if (!user) {
    return res.json(boom.badRequest());
  }
  try {
    await Events.rate({ user, text, bias, truth, eventId, sourceId });
  } catch (error) {
    return res.json(boom.badRequest());
  }

  return res.json({ status: "OK" });
});

router.get("/media-statistics", async (req, res) => {
  const medias = await Medias.getAll();

  return res.json(medias);
});

router.post("/add-source", async (req, res) => {
  const { name, title, url, eventId } = req.body;
  if (!name || !title || !url) {
    return res.json(boom.badRequest());
  }

  const source = await Events.addSource(eventId, { name, title, url });

  return res.json({ status: "OK" });
});

router.post("/add-event", async (req, res) => {
  const { title, category, date, description } = req.body;
  const { image } = req.files;

  try {
    const imageName = `/images/${new Date().getTime()}-${image.name}`;
    const a = await image.mv(`./static${imageName}`);
    const document = await Events.add({ title, category, date, description, image: imageName });

    return res.redirect(`/events/${document.insertedIds[0]}`);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
