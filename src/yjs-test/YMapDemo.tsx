// src/components/YMapDemo.tsx
import React, { useEffect, useState } from "react";
import { yMap } from "../yjsDoc";

export const YMapDemo: React.FC = () => {
  const [mapState, setMapState] = useState(Object.fromEntries(yMap.entries()));

  useEffect(() => {
    const observer = () => {
      setMapState(Object.fromEntries(yMap.entries()));
    };
    yMap.observe(observer);

    return () => yMap.unobserve(observer);
  }, []);

  const updateMap = () => {
    const key = `key${Math.floor(Math.random() * 100)}`;
    const value = `value${Math.floor(Math.random() * 100)}`;
    yMap.set(key, value);
  };

  return (
    <div>
      <button onClick={updateMap}>Update Map</button>
      <pre>{JSON.stringify(mapState, null, 2)}</pre>
    </div>
  );
};
