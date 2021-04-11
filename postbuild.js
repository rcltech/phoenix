const exec = require("child_process").exec;
const type = require("os").type;

const operatingSystem = type();

if (operatingSystem === "Linux")
  exec(
    "cp src/schema.graphql src/prisma.legacy.graphql ./dist && sed -i 's/src/dist/g' ./dist/schema.js"
  );
else if (operatingSystem === "Darwin")
  exec(
    "cp src/schema.graphql src/prisma.legacy.graphql ./dist && sed -i '' 's+src/schema.graphql+dist/schema.graphql+g' ./dist/schema.js"
  );
else throw new Error("Unsupported OS found: " + operatingSystem);
