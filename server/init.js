const express = require("express");
const schedule = require("node-schedule");
const axios = require("axios");

const getNewPapers = async db => {
  try {
    const result = await axios(
      "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&term=%28%28%28%28%28pediatrics%28%5BAll%20Fields%5D%20AND%20%28cancer%28%5BAll%20Fields%5D%29%20AND%20%28genomics%28%5BAll%20Fields%5D%29%20OR%20%28%28%28pediatrics%28%5BAll%20Fields%5D%20AND%20%28precision%28%5BAll%20Fields%5D%29%20AND%20%28medicine%28%5BAll%20Fields%5D%29%29%20OR%20%28%28%28map3k8%28%5BAll%20Fields%5D%20AND%20%28gene%28%5BAll%20Fields%5D%29%20AND%20%28fusion%28%5BAll%20Fields%5D%29%29%20OR%20%28%28%28acute%28%5BAll%20Fields%5D%20AND%20%28lymphoblastic%28%5BAll%20Fields%5D%29%20AND%20%28leukemia%28%5BAll%20Fields%5D%29&retmax=1000"
    );
    let ids = result.data.esearchresult.idlist;
    const idList = ids.join();
    const url =
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=" +
      idList;
    const res = await axios(url);
    const idSummary = res.data.result;
    ids.forEach(function(id, index) {
      let paper = {};
      paper["uid"] = id;
      paper["title"] = idSummary[id].title;
      let authors = idSummary[id].authors;
      let authNames = authors.map(a => a.name);
      let paperAuths = authNames.join(", ");
      paper["authors"] = paperAuths;
      paper["pubmed_id"] = idSummary[id].articleids[0].value;
      let baseUrl = "https://doi.org/";
      let elocationid = idSummary[id].elocationid.split(" ")[1];
      paper["url"] = baseUrl + elocationid;
      paper["pub_date"] = new Date(idSummary[id].pubdate);
      console.log(paper);

      let req = {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(paper)
      };

      db("papers")
        .insert(paper)
        .returning("*")
        .then(function(result) {
          console.log(res); // respond back to request
        });
    });
  } catch (error) {
    console.error(error);
  }
};

// use process.env variables to keep private variables,
require("dotenv").config();

// Express Middleware
const helmet = require("helmet"); // creates headers that protect from attacks (security)
const bodyParser = require("body-parser"); // turns response into usable format
const cors = require("cors"); // allows/disallows cross-site communication
const morgan = require("morgan"); // logs requests

// db Connection w/ Heroku
const db = require("knex")({
  client: "pg",
  connection: {
    connectionString:
      "postgres://kbnxgabwydzqkn:656ac57b6871ab7a537e25dcd3e19d22e6d222b2bad0e344752c29114065e636@ec2-174-129-27-158.compute-1.amazonaws.com:5432/d304mqr097lec7",
    ssl: true
  }
});

// Queries the PubMed database for the initial dataset.
console.log(
  "Checking PubMed for topical papers, and adding them to our database..."
);
getNewPapers(db);

// Controllers - aka, the db queries
const main = require("./controllers/main");

// App
const app = express();

// App Middleware
const whitelist = ["https://pubmedcustom-express-server.herokuapp.com/"];
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};
app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(morgan("combined")); // use 'tiny' or 'combined'

/*
// App Routes - Auth
app.get("/", (req, res) => res.send("hello world"));
app.get("/papers", (req, res) => main.getTableData(req, res, db));
app.post("/papers", (req, res) => main.postTableData(req, res, db));
app.put("/papers", (req, res) => main.putTableData(req, res, db));
app.delete("/papers", (req, res) => main.deleteTableData(req, res, db));

// App Server Connection
app.listen(process.env.PORT || 8000, () => {
  console.log(`app is running on port ${process.env.PORT || 8000}`);
});
*/
