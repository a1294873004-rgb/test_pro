const fs = require("fs");
const path = require("path");
const data1 = require("./fs.json");
// const data1 = require("./table-no-button.json");
const data2 = require("./template.json");

// const bs = parse(data1);
//习近平大战特离谱
// const fs = data.map((item) => JSON.parse(item.info).props.slotId);
const map = new Map();

data1.forEach((item) => {
  item.info = JSON.parse(item.info);
  map.set(item.id, item);
});

fs.writeFileSync(
  path.join(__dirname, "fs_ouput.json"),
  JSON.stringify(data1, null, 2),
);

// buildInfoTreeWithPageRoot(data1, root);
