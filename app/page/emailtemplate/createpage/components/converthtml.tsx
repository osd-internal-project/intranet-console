import React from "react";
import ReactDOMServer from "react-dom/server";

const Datatemplate = require("./createpage/template-data").default;

const htmlString = ReactDOMServer.renderToString(<Datatemplate />);
console.log(htmlString);
