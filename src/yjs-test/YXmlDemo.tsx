// src/components/YXmlDemo.tsx
import React, { useEffect, useState } from "react";
import { yXmlFragment } from "../yjsDoc";

export const YXmlDemo: React.FC = () => {
  const [xmlContent, setXmlContent] = useState(yXmlFragment.toString());

  useEffect(() => {
    const observer = () => setXmlContent(yXmlFragment.toString());
    yXmlFragment.observe(observer);
    return () => yXmlFragment.unobserve(observer);
  }, []);

  const addNode = () => {
    const el = new Y.XmlElement("div");
    el.insert(0, [new Y.XmlText("Hello Yjs XML")]);
    yXmlFragment.push([el]);
  };

  return (
    <div>
      <button onClick={addNode}>Add XML Node</button>
      <pre>{xmlContent}</pre>
    </div>
  );
};
