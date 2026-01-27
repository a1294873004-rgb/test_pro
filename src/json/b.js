const fs = require("fs");
const path = require("path");
// const data1 = require("./fs.json");
const data1 = require("./table-no-button.json");
const data2 = require("./template.json");

// const bs = parse(data1);
//习近平大战特离谱
// const fs = data.map((item) => JSON.parse(item.info).props.slotId);
const map = new Map();

data1.forEach((item) => {
  item.info = JSON.parse(item.info);
  map.set(item.id, item);
});
const root = {
  type: "page",
  meta: {
    id: "1rKV6vAmchZwbiPE88FiF",
    title: "12",
    createDate: 1768722936556,
    tags: [],
  },
  blocks: {
    type: "block",
    id: "root", // ✅ 使用之前代码里的 root id
    flavour: "affine:page",
    version: 2,
    props: {
      title: {
        "$blocksuite:internal:text$": true,
        delta: [{ insert: "12" }],
      },
    },
    children: [],
  },
};

function buildInfoTreeWithPageRoot(list, pageRoot) {
  const nodeMap = new Map();

  // 1️⃣ 建立 info 节点索引
  list.forEach((item) => {
    if (!item?.info?.id) return;

    if (item?.info?.flavour?.includes("yidooo")) {
      return;
    }
    nodeMap.set(item.info.id, {
      ...item.info,
      children: [],
    });

    if (item.info.flavour === "affine:surface") {
      if (item.info.props.elements.value) {
        item.info.props.elements = item.info.props.elements.value;
      }
      Object.values(item.info.props.elements || {}).forEach((prop) => {
        if (prop.type === "group") {
          prop.children = {
            "affine:surface:ymap": true,
            json: {
              ...prop.children,
            },
          };
        }
      });
    }
  });

  // 2️⃣ 组装父子关系
  list.forEach((item) => {
    const { parentId, info } = item;
    const currentNode = nodeMap.get(info.id);

    if (!currentNode) return;

    if (parentId && nodeMap.has(parentId)) {
      // ✅ 正常父子关系
      nodeMap.get(parentId).children.push(currentNode);
    } else {
      // ❗没有 parentId
      if (info.flavour === "affine:surface") {
        // ✅ surface → 插入到 affine:page block 下
        pageRoot.blocks.children.push(currentNode);
      } else {
        // 其他无 parent 的节点
        pageRoot.blocks.children.push(currentNode);
      }
    }
  });

  return pageRoot;
}

fs.writeFileSync(
  path.join(__dirname, "fs_ouput.json"),
  JSON.stringify(data1, null, 2),
);

buildInfoTreeWithPageRoot(data1, root);
