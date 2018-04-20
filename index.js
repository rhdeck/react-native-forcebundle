const fs = require("fs");
module.exports = {
  name: "setdevserver [server]",
  description:
    "Set the development server (or leave blank to revert to default of local machine IP)",
  func: (argv, config, args) => {
    const packagePath = process.cwd() + "/package.json";
    if (!fs.existsSync(packagePath)) {
      console.log(
        "This does not appear to be a valid directory. Try from your project root"
      );
      process.exit(1);
    }
    var package = require(packagePath);
    if (!argv || !argv[0]) {
      //Remove from package.json
      package.developmentServer = null;
      console.log("Successfully cleared the development server");
    } else {
      const server = argv[0];
      package.developmentServer = server;
      console.log("Successfully set your development server to " + server);
    }
    fs.writeFileSync(packagePath, JSON.stringify(package, null, 2));
  }
};
