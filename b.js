// const b = {
//   type: "block",
//   props: {
//     title: { "$blocksuite:internal:text$": true, delta: [{ insert: "图片" }] },
//     slotId: "image-p5572rpi",
//     autoSize: false,
//     minWidth: 400,
//     minHeight: 232,
//     keepAspectRatio: true,
//     rotate: 0,
//     scale: 1,
//     xywh: "[-3934.3018567420677,3408.733569178935,400,232]",
//     index: "a0",
//     lockedBySelf: false,
//     url: "",
//     error: false,
//     alt: "",
//     fit: "contain",
//     align: "center",
//     prompt:
//       "一条充满生活气息的旧城区老街，两侧是带着岁月痕迹的老宅建筑，首层开着各式各样的特色小店——明亮的便利店橱窗里摆满商品，温馨的花店门口绽放着缤纷鲜花，飘着醇香的咖啡店里人们低声交谈，热气腾腾的小食店传来阵阵诱人香气。每家店铺门前都整齐停放着颜色各异的电动车和自行车，为街道增添了几分活力。道路两旁种满了五颜六色的花卉，枝繁叶茂的大树投下斑驳树荫，阳光透过树叶间隙洒在石板路上。整条街道洋溢着温暖怀旧的氛围，细节处透露出宫崎骏动画中特有的细腻与魔幻感，32K高清画面将砖墙纹理、店铺招牌和花草细节都展现得淋漓尽致\n",
//     ossKey: "",
//     caption: { "$blocksuite:internal:text$": true, delta: [{ insert: "" }] },
//     "meta:bizNodeId": "",
//   },
//   id: "hrdVvEf7FC",
//   flavour: "yidooo:image",
//   version: 1,
//   agentLeftSideBarType: "TextToImage",
// };
// const b1 = {
//   type: "block",
//   props: {
//     title: { "$blocksuite:internal:text$": true, delta: [{ insert: "图片" }] },
//     slotId: "image-p5572rpi",
//     autoSize: false,
//     minWidth: 400,
//     minHeight: 232,
//     keepAspectRatio: true,
//     rotate: 0,
//     scale: 1,
//     xywh: "[-3566.3018567420672,3443.4002358456014,400,441]",
//     index: "a0",
//     lockedBySelf: false,
//     url: "//dscdn.yidooo.com/user/faccfa7f-73ff-4d51-88a7-ac53b9d144c2/2025-12-18/images/generation/1766062779713_8ec127a9.jpg",
//     error: false,
//     alt: "",
//     fit: "contain",
//     align: "center",
//     prompt:
//       "一条充满生活气息的旧城区老街，两侧是带着岁月痕迹的老宅建筑，首层开着各式各样的特色小店——明亮的便利店橱窗里摆满商品，温馨的花店门口绽放着缤纷鲜花，飘着醇香的咖啡店里人们低声交谈，热气腾腾的小食店传来阵阵诱人香气。每家店铺门前都整齐停放着颜色各异的电动车和自行车，为街道增添了几分活力。道路两旁种满了五颜六色的花卉，枝繁叶茂的大树投下斑驳树荫，阳光透过树叶间隙洒在石板路上。整条街道洋溢着温暖怀旧的氛围，细节处透露出宫崎骏动画中特有的细腻与魔幻感，32K高清画面将砖墙纹理、店铺招牌和花草细节都展现得淋漓尽致\n",
//     ossKey:
//       "user/faccfa7f-73ff-4d51-88a7-ac53b9d144c2/2025-12-18/images/generation/1766062779713_8ec127a9.jpg",
//     caption: { "$blocksuite:internal:text$": true, delta: [{ insert: "" }] },
//     "meta:bizNodeId": "",
//   },
//   id: "hrdVvEf7FC",
//   flavour: "yidooo:image",
//   version: 1,
// };

//  fetchDatas({
//           api: '/creation/node',
//           params: { nodeId },
//           auth: true,
//         }).then(res => {
//           if (res?.data?.code === 0) {
//             const node = res?.data?.data as ImageNode;
//             if (node.nodeType === 'image') {
//               const imageInfo = node.nodeData?.imageInfos?.[0];
//               if (imageInfo) {
//                 // 更新图片 url
//                 updateImageBlock(blockId, {
//                   url: imageInfo.imageViewUrl || '',
//                   prompt: imageInfo.prompt || '',
//                   ossKey: imageInfo.imageUrl || '',
//                   error: false,
//                 });
//               }
//             }
//           }
//         });
