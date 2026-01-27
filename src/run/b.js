const fs = require("fs");
const path = require("path");

// all avatar:

const avatars = [
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685780_8a19.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685780_f414.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685780_7984.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685780_dc81.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685780_d18b.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685782_bce5.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685782_503c.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685782_0c95.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685782_5d77.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685782_bc60.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685782_6069.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685782_e2dc.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685783_20a7.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685783_9e8d.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685783_a6c3.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685783_d9c9.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685783_7c28.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685783_05f1.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685783_38fe.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685783_c49b.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685783_9fd1.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685783_41c7.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685783_a30b.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685783_7e88.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685783_8eb7.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685784_5ca0.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685784_5b8d.svg",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397685784_baf2.svg",
];

// 1:1

const r11 = [
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397790866_f635.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397790832_5a12.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397790827_8334.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397790846_9026.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397790903_4581.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397790894_517b.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397790920_c2d5.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397790916_c382.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397790948_b5c0.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397790980_fd68.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397790985_4eae.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397790984_f6e0.webp",
];
// 3:4
const r34 = [
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397816304_01a5.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397816348_6923.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397816305_5a45.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397816362_4fc7.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397816466_dfd3.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397816456_8221.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397816509_772f.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397816514_9db0.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397816584_78b9.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397816611_c9a7.webp",
];

// 4:3

const r43 = [
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397832846_b2ec.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397832875_7ee6.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397832891_4366.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397832853_c9ea.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397832951_cbce.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397832924_6532.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397832971_9d8f.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397833678_feba.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397833368_d03a.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397833298_2e23.webp",
];
// 9:16:

const r916 = [
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397858542_0c54.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397858488_6d43.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397858457_06df.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397858508_9eb2.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397859200_b971.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397859294_3f6e.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397859214_c8de.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397859288_bd60.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397859723_9d7a.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397859741_798a.webp",
];
// 16:9
const r169 = [
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397877060_c238.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397877093_ab87.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397877051_0873.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397877041_1696.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397877330_f735.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397877346_ca69.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397877336_f382.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397877402_d4e4.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397877631_930e.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397877597_8dbf.webp",
];

// 21:9

const r219 = [
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397895495_521e.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397895503_9c0c.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397895486_0375.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397895488_c508.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397895537_0910.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397895564_8aa3.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397895553_a674.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397895576_c4d0.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397895599_302a.webp",
  "https://r.yidooo.com/yd_sys/web/front_end_oss_data/1769397895623_8da4.webp",
];
function createLoopIterator(arr) {
  let index = 0;
  return function () {
    const item = arr[index];
    index = (index + 1) % arr.length; // 核心逻辑：取模循环
    return item;
  };
}
const indexmap = ["1_1", "3_4", "4_3", "9_16", "16_9", "21_9"];
const all = [r11, r34, r43, r916, r169, r219];
const gen = createLoopIterator(avatars);
const allData = [];
let i = 0;
all.forEach((arr, index) => {
  arr.forEach((item, j) => {
    allData.push({
      id: i++,
      backgroundImg: "",
      cover: item,
      avatar: gen(),
      size: indexmap[index],
      title: "",
    });
  });
});

fs.writeFileSync(path.join(__dirname, "./data.json"), JSON.stringify(allData));
