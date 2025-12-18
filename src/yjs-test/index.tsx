// src/App.tsx
import React from "react";
import { YTextEditor } from "./YTextEditor";
import { YArrayList } from "./YArrayList";
import { YMapDemo } from "./YMapDemo";
import { YXmlDemo } from "./YXmlDemo";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Yjs React Demo</h1>
      <h2>Text</h2>
      <YTextEditor />
      <h2>Array</h2>
      <YArrayList />
      <h2>Map</h2>
      <YMapDemo />
      <h2>XML</h2>
      <YXmlDemo />
    </div>
  );
}

export { App as YjsTest };
