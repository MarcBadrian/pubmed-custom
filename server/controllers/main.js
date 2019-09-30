// sourced from https://medium.com/@olinations/build-a-crud-template-using-react-bootstrap-express-postgres-9f84cc444438

const getTableData = (req, res, db) => {
  db.select("*")
    .from("papers")
    .orderBy("pub_date", "desc")
    .then(items => {
      if (items.length) {
        res.json(items);
      } else {
        res.json({ dataExists: "false" });
      }
    })
    .catch(err => res.status(400).json({ dbError: "db error" }));
};

const postTableData = (req, res, db) => {
  const { uid, title, pubmed_id, authors, url, pub_date } = req.body;
  db("papers")
    .insert({ uid, title, pubmed_id, authors, url, pub_date })
    .returning("*")
    .then(item => {
      res.json(item);
    })
    .catch(err => res.status(400).json({ dbError: "db error" }));
};

const putTableData = (req, res, db) => {
  const { id, uid, title, pubmed_id, authors, url, pub_date } = req.body;
  db("papers")
    .where({ id })
    .update({ first, last, email, phone, location, hobby })
    .returning("*")
    .then(item => {
      res.json(item);
    })
    .catch(err => res.status(400).json({ dbError: "db error" }));
};

const deleteTableData = (req, res, db) => {
  const { id } = req.body;
  db("papers")
    .where({ id })
    .del()
    .then(() => {
      res.json({ delete: "true" });
    })
    .catch(err => res.status(400).json({ dbError: "db error" }));
};

module.exports = {
  getTableData,
  postTableData,
  putTableData,
  deleteTableData
};
