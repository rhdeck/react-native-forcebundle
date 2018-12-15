#!/usr/bin/env node
var pbxproj = require("@raydeck/xcode");
var fs = require("fs");
var path = require("path");
var glob = require("glob");
//Get my directory
//Work from working dir
const p = path.join(process.cwd(), "ios", "*.xcodeproj", "project.pbxproj");
let filename = glob.sync(p)[0];
if (!fs.existsSync(filename)) {
  console.log("Could not find pbxproj file:", filename);
  process.exit(1);
}
var proj = pbxproj.project(filename);
replaceVal =
  '"export NODE_BINARY=node\\n../node_modules/react-native-forcebundle/bin/react-native-xcode.sh"';
proj.parse(function(err) {
  Object.keys(proj.hash.project.objects.PBXShellScriptBuildPhase).forEach(
    key => {
      let container = proj.hash.project.objects.PBXShellScriptBuildPhase[key];
      const oldVal = container.shellScript;
      if (oldVal && oldVal.length) {
        if (
          oldVal.startsWith(
            '"export NODE_BINARY=node\\n../node_modules/react-native/scripts/react-native-xcode.sh'
          )
        ) {
          //lets replace it
          console.log("Adding reference to new shell script code");
          container.shellScript = replaceVal;
        }
      }
    }
  );
  const out = proj.writeSync();
  fs.writeFileSync(filename, out);
});
