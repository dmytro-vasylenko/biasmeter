const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUploader = require("express-fileupload");

const config = require("./config");

const app = express();

app.use(express.static(`${__dirname}/static`));
app.use(bodyParser({ extended: true }));
app.use(cors());
app.use(fileUploader());
app.use(require("./controllers/"));

app.listen(config.port, () => console.log(`Server is listening ${config.port}`));
