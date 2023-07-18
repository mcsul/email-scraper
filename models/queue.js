const mongoose = require("mongoose");
const _schema = new mongoose.Schema(
  {
    site_id: {
      type: Object,
      required: true,
    },
    page_url: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
md = mongoose.model("SiteQueue", _schema, "site_queues");
module.exports = md;
