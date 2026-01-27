import { ImageCropper } from "src/ImageCropper";
import { useState } from "react";

function ImageCropperTest() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [source, setSource] = useState<string | File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSource(file); // 传入 File 对象
    }
  };
  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          margin: 100,
          border: "1px solid",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            marginBottom: 200,
            position: "relative",
            left: 500,
          }}
        >
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        {source && (
          <ImageCropper
            source={source}
            containerSize={{
              width: 300,
              height: 300,
            }}
            aspectRatios={[
              {
                label: "3:4",
                value: 3 / 4,
              },
              {
                label: "16:9",
                value: 16 / 9,
              },
              {
                label: "1:1",
                value: 1,
              },
            ]}
            onComplete={(blob) => {
              if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
              }

              const url = URL.createObjectURL(blob);

              setPreviewUrl(url);

              console.log("生成的 Blob 对象:", blob);
            }}
          />
        )}
        <div>
          {previewUrl && (
            <div
              style={{
                position: "relative",
                zIndex: 100,
              }}
            >
              <h3>预览结果：</h3>
              <img
                src={previewUrl}
                alt="预览图"
                style={{
                  maxWidth: "100%",
                  width: 200,
                  height: 200,
                  objectFit: "contain",
                  border: "1px solid green",
                }}
              />
              <button onClick={() => window.open(previewUrl)}>查看原图</button>
            </div>
          )}
        </div>
      </div>

      {/* <ImageList /> */}
    </div>
  );
}

export { ImageCropperTest };
