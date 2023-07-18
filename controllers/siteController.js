const Site = require("../models/site");

const index = (req, res) => {
  Site.find()
    .then((result) => {
      res.json({ data: result });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
};

const get = (req, res) => {
  const id = req.params.id;
  Site.findById(id)
    .then((result) => {
      if (result) res.json({ data: result });
      else res.json({ data: "Site Not Found" });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
};

const update = (req, res) => {
  const id = req.params.id;
  Site.updateOne({ _id: id }, { $set: req.body })
    .then((result) => {
      res.json({ data: result });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
};

const store = (req, res) => {
  const user = new Site(req.body);
  user
    .save()
    .then((result) => {
      res.json({ id: result._id });
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: err.message });
    });
};

const destroy = (req, res) => {
  const id = req.params.id;
  Site.findByIdAndDelete(id)
    .then((result) => {
      res.json({ data: 1 });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
};

module.exports = {
  index,
  get,
  store,
  update,
  destroy,
};
