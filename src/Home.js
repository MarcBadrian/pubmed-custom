import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

export default function Home() {
  const [ids, setIds] = useState([]);
  const [summary, setSummary] = useState({});
  const [title, setTitle] = useState("");
  const [pubMedId, setPubMedId] = useState("");
  const [auths, setAuths] = useState([]);

  const [query, setQuery] = useState("react");

  useEffect(() => {
    let ignore = false;

    async function fetchIds() {
      const result = await axios(
        "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&term=%28pediatrics%20neoplasms%20genomics%5BMeSH%20Terms%5D%29%20AND%20%28%222019%2F01%2F09%22%5BDate%20-%20MeSH%5D%20%3A%20%223000%22%5BDate%20-%20MeSH%5D%29"
      );
      if (!ignore) setIds(result.data.esearchresult.idlist);
    }

    fetchIds();

    async function fetchSummary() {
      const id = "31253791";
      const url =
        "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&rettype=abstract&id=" +
        id;
      const result = await axios(url);
      const idSummary = result.data.result;
      if (!ignore) {
        setTitle(idSummary[id].title);
        let authors = idSummary[id].authors;
        let authNames = authors.map(a => a.name);
        setAuths(authNames);
        setPubMedId(idSummary[id].articleids[0].value);
      }
    }

    fetchSummary();

    console.log(summary);

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div>
      <ul>
        <li>
          <b>Title:</b> {title}
        </li>
        <li>
          <b>PubMed Id:</b> {pubMedId}
        </li>
        <li>
          <b>Authors:</b> {auths.join(", ")}
        </li>
      </ul>
    </div>
  );
}

//    fetch("http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&term=%28pediatrics%20neoplasms%20genomics%5BMeSH%20Terms%5D%29%20AND%20%28%222019%2F01%2F09%22%5BDate%20-%20MeSH%5D%20%3A%20%223000%22%5BDate%20-%20MeSH%5D%29")
