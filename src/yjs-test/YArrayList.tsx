// src/components/YArrayList.tsx
import React, { useEffect, useState } from "react";
import { yArray } from "../yjsDoc";

export const YArrayList: React.FC = () => {
  const [items, setItems] = useState(yArray.toArray());

  useEffect(() => {
    const observer = (event: Y.YArrayEvent<string>) => {
      setItems(yArray.toArray());
    };

    yArray.observe(observer);

    return () => yArray.unobserve(observer);
  }, []);

  const addItem = () => {
    yArray.push([`Item ${yArray.length + 1}`]);
  };

  const removeItem = (index: number) => {
    yArray.delete(index, 1);
  };

  return (
    <div>
      <button onClick={addItem}>Add Item</button>
      <ul>
        {items.map((item, i) => (
          <li key={i}>
            {item} <button onClick={() => removeItem(i)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
