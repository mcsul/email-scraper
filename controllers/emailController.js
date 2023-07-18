const Email = require("../models/email");
const Site = require("../models/site");
const axios = require("axios");

var extractEmail = require("extract-email-address");

const crawler = async (req, res) => {
  if (!req.body.url) {
    res.json({ error: "Invalid URL" });
    return;
  }

  const url = req.body.url;

  const result = await Email.find({ page_url: url }, "email_address length");
  if (result.length) {
    res.json({ data: result });
    return;
  }

  let site_id = "",
    crawl = false;
  let domain = new URL(url);
  let rs = await Site.find({ site_url: domain.origin }, "site_url length");
  if (!rs.length) {
    const site = await Site.create({
      company: domain.hostname,
      site_url: domain.origin,
      status: "active",
    });

    const data = await site.save();
    site_id = data.id;
    crawl = true;
  } else {
    site_id = rs[0].id;
  }
  if (!crawl) {
    res.json({ data: [] });
    return;
  }
  let response = await fetchData(url);
  if (!response.data) {
    res.json({ error: "Invalid data Obj" });
    return;
  }

  let emails,
    emailsArr = [];
  emails = extractEmail.default(response.data);
  emails.map(function (val) {
    emailsArr.push(val.email);
  });
  // let emailsArr = [
  //   "sale@kayasystems.com",
  //   "sales@kayasystems.com",
  //   "info@kayasystems.com",
  // ];

  emailsArr.map(function (val) {
    let data = {
      site_id: site_id,
      page_url: url,
      email_address: val,
    };

    const user = new Email(data);
    user
      .save()
      .then((result) => {
        console.log({ id: result._id });
      })
      .catch((err) => {
        console.log(err);
        res.json({ error: err.message });
      });
  });
  res.json({ data: emailsArr });
};

async function fetchData(url) {
  console.log("Crawling data...");

  // make http call to url
  let response = await axios(url).catch((err) => console.log(err));
  // let response = await axios.create({
  //   baseURL: url,
  //   timeout: 60000, //optional
  //   httpsAgent: new https.Agent({ keepAlive: true }),
  //   headers: { "Content-Type": "application/xml" },
  // });

  // const Agent = require("agentkeepalive");
  // const HttpsAgent = require("agentkeepalive").HttpsAgent;

  // const keepAliveAgent = new Agent({
  //   maxSockets: 160,
  //   maxFreeSockets: 160,
  //   timeout: 60000,
  //   freeSocketTimeout: 30000,
  //   keepAliveMsecs: 60000,
  // });

  // const httpsKeepAliveAgent = new HttpsAgent({
  //   maxSockets: 160,
  //   maxFreeSockets: 160,
  //   timeout: 60000,
  //   freeSocketTimeout: 30000,
  //   keepAliveMsecs: 60000,
  // });

  // const axiosInstance = axios.create({
  //   baseURL: url,
  //   httpAgent: keepAliveAgent,
  //   httpsAgent: httpsKeepAliveAgent,
  // });
  // const response = axiosInstance.get();
  if (response.status !== 200) {
    console.log("Error occurred while fetching data");
    return;
  }
  return response;
}

const index = async (req, res) => {
  // const result = await Email.find(
  //   { site_id: req.body.site_id },
  //   "email_address length"
  // );
  // if (result.length) {
  //   res.json({ data: result });
  //   return;
  // }
  Email.find()
    .then((result) => {
      res.json({ data: result });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
};

const get = (req, res) => {
  const id = req.params.id;
  Email.find({ site_id: id }, "email_address length")
    .then((result) => {
      if (result) res.json({ data: result });
      else res.json({ data: "Email Not Found" });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
};

const update = (req, res) => {
  const id = req.params.id;
  Email.updateOne({ _id: id }, { $set: req.body })
    .then((result) => {
      res.json({ data: result });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
};

const store = async (req, res) => {
  const { site_id, page_url, email_address } = req.body;
  const email = await Email.create({
    site_id,
    page_url,
    email_address,
  });

  const data = await email.save();
  return res.send(data);
};

const destroy = (req, res) => {
  const id = req.params.id;
  Email.findByIdAndDelete(id)
    .then((result) => {
      res.json({ data: 1 });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
};

module.exports = {
  index,
  crawler,
  get,
  store,
  update,
  destroy,
};
