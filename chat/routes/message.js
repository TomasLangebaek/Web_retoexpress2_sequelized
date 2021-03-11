var express = require("express");
var router = express.Router();

const Joi = require("joi");
const Message = require("../models/message");

router.get("/", function (req, res, next) {
  Message.findAll().then((result) => {
    res.send(result);
  });
});

router.get("/:id", (req, res) => {
  Message.findByPk(req.params.id).then((response) => {
    if (response === null)
      return res
        .status(404)
        .send("The message with the given id was not found.");
    res.send(response);
  });
});

router.post("/:id", function (req, res, next) {
  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    author: Joi.string()
      .regex(/([a-zA-Z])*\s{1}([a-zA-Z])*/)
      .required(),
    id: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  Message.create({
    message: req.body.message,
    author: req.body.author,
    id: req.body.id,
  }).then((result) => {
    res.send(result);
  });
});

router.put("/:id", (req, res) => {
  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    author: Joi.string()
      .regex(/([a-zA-Z])*\s{1}([a-zA-Z])*/)
      .required(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error);
  }

  Message.update(req.body, { where: { id: req.params.id } }).then(
    (response) => {
      if (response[0] !== 0)
        res.send({ success: true, msg: "Message updated" });
      else res.status(404).send({ message: "Message was not found" });
    }
  );
});

router.delete("/:id", (req, res) => {
  Message.destroy({
    where: {
      id: req.params.id,
    },
  }).then((response) => {
    if (response === 1)
      res
        .status(200)
        .send({ success: true, msg: "Message removed successfully" });
    else res.status(404).send({ message: "Message was not found" });
  });
});

module.exports = router;
