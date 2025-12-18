import React, { useState } from "react";
import { Select } from "antd";

const { Option } = Select;

interface OptionType {
  fs: number;
  name1: string;
}

const options: OptionType[] = [
  { fs: 11, name1: "苹果" },
  { fs: 22, name1: "香蕉" },
  { fs: 3, name1: "橙子" },
];

const MySelect: React.FC = () => {
  const [value, setValue] = useState<OptionType>();

  const handleChange = (val: number) => {
    setValue(options.find((item) => item.fs === val));
    console.log("选中值:", val);
  };

  const imgs = [
    "https://dscdn.yidooo.com/yd_sys/web/front_end_oss_data/1765852415131_891c.webp",
    "https://scdn.yidooo.com/yd_sys/web/front_end_oss_data/1765852415131_891c.webp",

    "https://dscdn.yidooo.com/yd_sys/web/front_end_oss_data/1765852415072_7c0b.webp",
    "https://scdn.yidooo.com/yd_sys/web/front_end_oss_data/1765852415072_7c0b.webp",
  ];
  return (
    <div>
      {imgs.map((item) => (
        <img src={item} />
      ))}

      <Select<number>
        value={value?.fs}
        style={{ width: 200 }}
        placeholder="请选择水果"
        onChange={handleChange}
        //   options={options.map((item) => ({ label: item.name1, value: item.fs }))}
        options={options}
        //   labelInValue
        fieldNames={{
          label: "name1",
          value: "fs",
        }}
      ></Select>
    </div>
  );
};

export { MySelect };
