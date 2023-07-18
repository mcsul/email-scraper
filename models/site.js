const mongoose = require("mongoose");
const _schema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },
    site_url: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
md = mongoose.model("SiteInfo", _schema, "site_infos");
module.exports = md;
