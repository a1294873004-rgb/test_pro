// src/components/YTextEditor.tsx
import React, { useEffect, useState } from "react";
import { yText } from "../yjsDoc";

export const YTextEditor: React.FC = () => {
  const [text, setText] = useState<string>(yText.toString());

  useEffect(() => {
    const observer = (event: Y.YTextEvent) => {
      setText(yText.toString());
    };

    yText.observe(observer);

    return () => yText.unobserve(observer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    yText.delete(0, yText.length); // 清空
    yText.insert(0, e.target.value); // 插入新文本
  };

  return <textarea value={text} onChange={handleChange} rows={5} cols={50} />;
};
