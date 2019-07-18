const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000

const app = express();

app.get("/", function(req, res) {
	res.sendFile(path.join(__dirname, "views/index.html"));
	console.log("New Request: Method - " + req.route.stack[0].method + "   " + " Route - " + req.route.path);
});

app.use("/public", express.static("./public"));
app.use(express.static(path.join(__dirname, 'frontend')));
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))