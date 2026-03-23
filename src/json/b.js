const urlStr =
  "https://accounts.google.com/v3/signin/accountchooser?client_id=549479365050-nmd0il7akpb9nrqlpaadii8n6ds81msn.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fapi.yidooo.com%2Fuser%2Fgoogle%2Foauth2callback&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&state=eyJyZWRpcmVjdFVyaSI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA5MC9ob21lIiwiY3NyZlRva2VuIjoiOTJlNjM5YzItZjU2Ni00OWNhLTk5NzktNzJjY2RmMmNkZWQ3In0%3D&dsh=S-835924838%3A1772098885354470&o2v=1&service=lso&flowName=GeneralOAuthFlow&opparams=%253F&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAO9coGApE48QUX-Fhd1elciMrkxqt3QHYmrVTkZCSXm_8-sYIWlVnM7RdccLTC9xmwZj6pnzOxgbzD8wJqSPMPiREdGZf9Da6CEfSBCSQJCEzBy9U0HAKvFZutH5NidQcpytvxIq0LCkwWh6LQgDAwlxsNMbMtnw6LugYfXrshT5F1pu5eNu5chKqpdgGWX3ZcFchDDF8IaGe9Q3cn1FMXvEZHkcXViuQ2bu3yTURANThm3C3-0cRsuDa3Hep7A23EBwvOXONdQV7Sn93KgcMX_BI_bCVnw6ybKfaUSE-DqCB03Do8CneRB0ujBLYKAazKDscnO4jeB1m5WYmBMlBXhzG9jQ6RFkmcSRiMsnDihe39UuLL-4Ljth9pkBska6SbakzRUiSX41s0PiZi6Wqh9zRCA-2QkbvpmzT4stJT4ewJMCJcvaCinE4hXMcYRG9yX64aqwKiFWk9_LYz2fvbLjEQUKQ%26flowName%3DGeneralOAuthFlow%26as%3DS-835924838%253A1772098885354470%26client_id%3D549479365050-nmd0il7akpb9nrqlpaadii8n6ds81msn.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23&app_domain=https%3A%2F%2Fapi.yidooo.com"; // 你的完整链接

const url = new URL(urlStr);

// 1. 获取解码后的完整参数字符串 (从 ? 开始)
const decodedSearch = decodeURIComponent(url.search);
console.log("解码后的全量 Query:", decodedSearch);

// 2. 将所有参数转成一个对象，方便直接使用
const params = {};
url.searchParams.forEach((value, key) => {
  params[key] = value; // 这里拿到的 value 已经是自动解码过的了
});

console.log("参数对象:", params);

// 特别针对你的 state 参数进行 Base64 解码 (因为它看起来是 Base64 编码的 JSON)
if (params.state) {
  const decodedState = atob(params.state);
  console.log("State 内部数据:", JSON.parse(decodedState));
}
