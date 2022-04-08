const converter = require("json-sql")({ separatedValues: false, dialect: "mysql" });
const fs = require("fs");
async function buildInsertSQL(data, relation) {
  let output = "";
  data.forEach((val) => {
    output += converter.build({
      type: "insert",
      table: relation,
      values: val,
    }).query;
    output += "\n";
  });
  await fs.writeFile(`${relation}.sql`, output, () => {
    console.log(`Success generating member of ${relation}`);
  });
}

module.exports = { buildInsertSQL };
