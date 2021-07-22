const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const axios = require("axios").default;

dotenv.config();
const app = express();

const PORT = process.env.PORT || 9001;
const baseUrl = "https://www.lojastorra.com.br/";

app.use(cors());
app.use(express.json());
app.post("/register", async (req, res) => {
  try {
    const { data } = await axios({
      method: "PUT",
      url: `${baseUrl}/api/dataentities/CL/documents`,
      headers: {
        accept: "application/vnd.vtex.ds.v10+json",
        "content-type": "application/json",
        "x-vtex-api-appkey": process.env.APPKEY,
        "x-vtex-api-apptoken": process.env.APPTOKEN,
      },
      data: {
        ...req.body,
      },
    });
    res.status(200).json({ data });
  } catch (error) {
    if (error.message === "Request failed with status code 304")
      return res.status(400).json({ error: "Usuário já registrado" });
    res.status(404).json({ error });
  }
});

app.get("/:params", async (req, res) => {
  const { email } = req.query;
  try {
    const { data } = await axios({
      method: "GET",
      url: `${baseUrl}/api/dataentities/CL/search?_where=email=${email}&_fields=birthDate`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.vtex.ds.v10+json",
        "x-vtex-api-appkey": process.env.APPKEY,
        "x-vtex-api-apptoken": process.env.APPTOKEN,
      },
    });
    res.status(200).json({ data });
  } catch (error) {
    if (error.message === "Request failed with status code 304")
      return res.status(400).json({ error: "Usuário não encontrado" });
    res.status(404).json({ error });
  }
});

app.listen(PORT, () => {
  console.log("running on " + PORT);
});
