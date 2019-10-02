import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

export default function Home() {
  const [dbPapers, setDbPapers] = useState([]);
  const [papers, setPapers] = useState([{}]);

  useEffect(() => {
    let ignore = false;

    async function getItems() {
      fetch("https://pubmedcustom-express-server.herokuapp.com/papers")
        .then(response => response.json())
        .then(items => setDbPapers(items))
        .catch(err => console.log(err));
    }

    getItems();

    return () => {
      ignore = true;
    };
  }, []);

  const listPapers = dbPapers.map(paper => (
    <>
      <li key={paper.title}>
        <b>Title:</b> {paper.title}
      </li>
      <li key={paper.pubmed_id}>
        <b>PubMed ID:</b> {paper.pubmed_id}
      </li>
      <li key={paper.authors}>
        <b>Authors:</b> {paper.authors}
      </li>
      <li key={paper.url}>
        <a href={paper.url}>Link to paper</a>
      </li>
      <br />
    </>
  ));

  return (
    <div>
      <h1>PubMed Papers Relating to the Following Topics:</h1>
      <h4>
        Pediatric cancer genomics • Pediatric precision medicine • MAP3K8 gene
        fusion • Acute Lymphoblastic Leukemia
      </h4>
      <ul>{listPapers}</ul>
    </div>
  );
}
