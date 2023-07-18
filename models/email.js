const mongoose = require("mongoose");
const _schema = new mongoose.Schema(
  {
    site_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "site_infos",
    },
    page_url: {
      type: String,
      required: true,
    },
    email_address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
md = mongoose.model("SiteEmail", _schema, "site_emails");
module.exports = md;
