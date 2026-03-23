{
  //get
  const url = "http://api.yidooo.com/content";
  const subUrl = "/creation/node";
  const token =
    "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJhY2NvdW50XCI6XCJhMTI5NDg3MzAwNEBnbWFpbC5jb21cIixcInVzZXJJZFwiOlwiZmFjY2ZhN2YtNzNmZi00ZDUxLTg4YTctYWM1M2I5ZDE0NGMyXCJ9IiwiaWF0IjoxNzcyMDc2MDE3LCJleHAiOjE3NzIzMzUyMTd9.9IY5vUKwrcuF7zm6hV9cJ7e2oT2l-i7-qd2sOF0zGc4oM81twIsBRZIBa6pXnNJfZ40eRKT1ZxJluEi8vqff_A";
  // 即使这里按回车，只要括号没闭合，有些浏览器版本会智能等待

  const params = {
    nodeId: "1418608f-035d-43dd-a426-85b7585ef58b", // 包含空格和中文
  };

  const urlWithParams = `${url}${subUrl}?${new URLSearchParams(params)}`;
  const response = await fetch(urlWithParams, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  console.log("GET 结果:", data);
}
{
  // post
  // 1. 配置基础信息
  const url = "http://api.yidooo.com/content";
  const subUrl = "/creation/node";
  const token =
    "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJhY2NvdW50XCI6XCJhMTI5NDg3MzAwNEBnbWFpbC5jb21cIixcInVzZXJJZFwiOlwiZmFjY2ZhN2YtNzNmZi00ZDUxLTg4YTctYWM1M2I5ZDE0NGMyXCJ9IiwiaWF0IjoxNzcyMDc2MDE3LCJleHAiOjE3NzIzMzUyMTd9.9IY5vUKwrcuF7zm6hV9cJ7e2oT2l-i7-qd2sOF0zGc4oM81twIsBRZIBa6pXnNJfZ40eRKT1ZxJluEi8vqff_A";

  // 2. 准备要发送的数据对象
  const bodyData = {
    nodeId: "1418608f-035d-43dd-a426-85b7585ef58b",
    // 这里可以添加更多 POST 专用的字段
  };

  // 3. 发起请求
  const response = await fetch(`${url}${subUrl}`, {
    method: "POST",
    headers: {
      Authorization: token, // 这里的 token 已经包含 Bearer，直接用即可
      "Content-Type": "application/json", // 告知服务器你发送的是 JSON 格式
    },
    body: JSON.stringify(bodyData), // 将 JS 对象转为 JSON 字符串
  });

  // 4. 处理响应
  const data = await response.json();
  console.log("POST 结果:", data);
}
