const app = require("express")();
const dataBase = require("./src/dbservice");

//TODO: to env
const PORT = 3000;

const routs = require("./src/routs");
app.use(routs);

app.use(function (err, _req, res) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use((req, res, next) => {
  res.status(404).type("text/plain");
  res.send("Not found");
});

const expressHandlebars = require("express-handlebars");
const hbs = expressHandlebars.create({
  defaultLayout: "main",
  extname: "hbs",
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

dataBase.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
