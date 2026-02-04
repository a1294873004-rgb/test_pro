import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// import ImageEditor from "tui-image-editor";
import ImageEditor from "./libs/image-editor/src/index.js";
// import "tui-image-editor/dist/tui-image-editor.css";
import styles from "./index.module.less";

import classNames from "classnames";
import { Button, Divider, Popover, Select, Slider, Splitter } from "antd";
import { SliderSingleProps } from "antd/es/slider/index.js";
import { Icon } from "src/components/Icon";

type ColorType = "stroke" | "fill";
type ToolID =
  | "undo"
  | "redo"
  | "free"
  | "line"
  | "rect"
  | "circle"
  | "arrow"
  | "text"
  | "clip";
const emptyCropRectValues = {
  LEFT: 0,
  TOP: 0,
  WIDTH: 0.5,
  HEIGHT: 0.5,
};
const PickColors = [
  "#FFFFFF",
  "#000000",
  "#E58B8B",
  "#E5C78A",
  "#C7E58A",
  "#8AE58A",
  "#99FFDD",
  "#99DDFF",
  "#9999FF",
  "#FF99FF",
];

const ratios: { label: string; value: number }[] = [
  {
    label: "1:1",
    value: 1,
  },
  {
    label: "3:4",
    value: 3 / 4,
  },
  {
    label: "4:3",
    value: 4 / 3,
  },
  {
    label: "9:16",
    value: 9 / 16,
  },
  {
    label: "16:9",
    value: 16 / 9,
  },
  {
    label: "21:9",
    value: 21 / 9,
  },
];
// import "tui-code-snippet/dist/tui-code-snippet.css";
function isEmptyCropzone(cropRect: any) {
  const { left, top, width, height } = cropRect;
  const { LEFT, TOP, WIDTH, HEIGHT } = emptyCropRectValues;

  return left === LEFT && top === TOP && width === WIDTH && height === HEIGHT;
}

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = "*",
  label = "上传文件",
}) => {
  // 创建一个对 input 元素的引用
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    // 触发隐藏 input 的点击事件
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      // 重置 value，确保同一个文件可以连续上传
      event.target.value = "";
    }
  };

  return (
    <div style={{ display: "block", marginBottom: 100 }}>
      {/* 隐藏原始 input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        style={{ display: "none" }}
      />

      {/* 自定义触发按钮 */}
      <button
        onClick={handleClick}
        style={{
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {label}
      </button>
    </div>
  );
};

const SizeSlider: React.FC<SliderSingleProps> = (props) => {
  return <Slider {...props} className={styles.slider} />;
};
const ColorList: React.FC<{
  color: string;
  colors: string[];
  colorType: ColorType;
  onClick: (color: string) => void;
}> = ({ colors, colorType, onClick, color }) => {
  return (
    <div className={styles.colors}>
      {colors.map((item) => (
        <div
          onClick={() => {
            onClick(item);
          }}
          key={item}
          className={classNames(
            styles.colorItem,
            styles[colorType],
            color === item && styles.active,
          )}
          style={{
            borderColor: item,
            backgroundColor: colorType === "fill" ? item : undefined,
          }}
        />
      ))}
    </div>
  );
};

const FreeDrawMenu: React.FC<{
  colors?: string[];
  activeTool: ToolID | undefined;
  onChangeTool: (tool: ToolID | undefined) => void;
  imageEditor: ImageEditor;
}> = ({ colors = PickColors, imageEditor, activeTool, onChangeTool }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!!activeTool && ["line", "free"].includes(activeTool));
  }, [activeTool]);
  const [size, setSize] = useState<number>(16);
  const [color, setColor] = useState(colors?.[0]);

  useEffect(() => {
    if (activeTool && ["line", "free"].includes(activeTool)) {
      imageEditor.stopDrawingMode();
      imageEditor.startDrawingMode(
        activeTool === "line" ? "LINE_DRAWING" : "FREE_DRAWING",
        {
          width: size,
          color: color,
        },
      );
    }
  }, [activeTool, size, color]);
  return (
    <Popover
      styles={{
        container: {
          padding: 0,
        },
      }}
      classNames={{
        root: styles.Popover,
      }}
      trigger={"click"}
      zIndex={100}
      placement="bottom"
      content={
        <div className={styles.FreeDrawMenu}>
          <div className={styles.left}>
            <div
              className={classNames(
                activeTool === "line" && styles.active,
                styles.toolButton,
              )}
              onClick={() => {
                onChangeTool("line");

                const isActive = activeTool !== "line";
                if (isActive) {
                  imageEditor.discardSelection();
                  imageEditor.changeSelectableAll(true);

                  imageEditor.stopDrawingMode();

                  imageEditor.startDrawingMode("LINE_DRAWING", {
                    width: size,
                    color: color,
                  });
                } else {
                  imageEditor.discardSelection();
                  imageEditor.changeSelectableAll(true);
                  imageEditor.changeSelectableAll(true);
                  imageEditor.stopDrawingMode();
                }
              }}
            >
              <Icon symbol="image-clip-line-pen" width={24} height={24} />
            </div>
            <div
              className={classNames(
                activeTool === "free" && styles.active,
                styles.toolButton,
              )}
              onClick={() => {
                onChangeTool("free");

                const isActive = activeTool !== "free";
                if (isActive) {
                  imageEditor.discardSelection();
                  imageEditor.changeSelectableAll(true);

                  imageEditor.stopDrawingMode();

                  imageEditor.startDrawingMode("FREE_DRAWING", {
                    width: size,
                    color: color,
                  });
                } else {
                  imageEditor.discardSelection();
                  imageEditor.changeSelectableAll(true);
                  imageEditor.changeSelectableAll(true);
                  imageEditor.stopDrawingMode();
                }
              }}
            >
              <Icon symbol="image-clip-free-pen" width={24} height={24} />
            </div>
            <SizeSlider
              value={size}
              onChange={(size) => {
                setSize(size);
              }}
              max={80}
              min={1}
              step={1}
            />
          </div>

          <Divider orientation="vertical" className={styles.Divider} />
          <ColorList
            colorType="fill"
            colors={colors}
            color={color}
            onClick={setColor}
          />
        </div>
      }
      open={open}
    >
      <div
        className={classNames(
          ((!!activeTool && ["free", "line"].includes(activeTool)) || open) &&
            styles.active,
          styles.toolButton,
        )}
        onClick={() => {
          const disable = !!activeTool && ["free", "line"].includes(activeTool);
          if (disable) {
            imageEditor.stopDrawingMode();
            imageEditor.discardSelection();
            imageEditor.changeSelectableAll(true);
            onChangeTool(undefined);
          } else {
            imageEditor.discardSelection();
            imageEditor.changeSelectableAll(true);

            imageEditor.stopDrawingMode();

            imageEditor.startDrawingMode("FREE_DRAWING", {
              width: size,
              color: color,
            });

            onChangeTool("free");
          }
        }}
      >
        {!!activeTool && ["free", "line"].includes(activeTool) ? (
          <Icon symbol="image-clip-pen-active" width={24} height={24} />
        ) : (
          <Icon symbol="image-clip-pen" width={24} height={24} />
        )}
      </div>
    </Popover>
  );
};

const ShapeDrawMenu: React.FC<{
  type: "rect" | "circle" | "arrow";
  colors?: string[];
  activeTool: ToolID | undefined;
  onChangeTool: (tool: ToolID | undefined) => void;
  imageEditor: ImageEditor;
}> = ({ colors = PickColors, imageEditor, activeTool, onChangeTool, type }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(activeTool === type);
  }, [activeTool]);
  const [size, setSize] = useState<number>(16);
  const [fill, setFill] = useState(true);
  const [color, setColor] = useState(colors?.[0]);
  const isIcon = type === "arrow";
  useEffect(() => {
    if (type === activeTool) {
      if (isIcon) {
        console.log("draw icon", type, color);
        imageEditor.stopDrawingMode();

        imageEditor.startDrawingMode("ICON");
        imageEditor.setDrawingIcon(type, color);
      } else {
        imageEditor.startDrawingMode("SHAPE");
        imageEditor.setDrawingShape(type, {
          stroke: color,
          fill: fill ? color : "",
          strokeWidth: size,
        });
      }
    }
  }, [activeTool, size, color, type, fill, isIcon]);

  const ToolIcon = useMemo(() => {
    const isActive = activeTool === type;
    if (type === "arrow") {
      return isActive ? (
        <Icon symbol="image-clip-arrow-active" width={24} height={24} />
      ) : (
        <Icon symbol="image-clip-arrow" width={24} height={24} />
      );
    }
    if (type === "rect") {
      return isActive ? (
        <Icon symbol="image-clip-rect-active" width={24} height={24} />
      ) : (
        <Icon symbol="image-clip-rect" width={24} height={24} />
      );
    }
    if (type === "circle") {
      return isActive ? (
        <Icon symbol="image-clip-circle-active" width={24} height={24} />
      ) : (
        <Icon symbol="image-clip-circle" width={24} height={24} />
      );
    }
  }, [type, activeTool]);

  return (
    <Popover
      styles={{
        container: {
          padding: 0,
        },
      }}
      classNames={{
        root: styles.Popover,
      }}
      trigger={"click"}
      zIndex={100}
      placement="bottom"
      content={
        <div className={styles.FreeDrawMenu}>
          {!isIcon && (
            <>
              <div className={styles.left}>
                <Icon symbol="image-clip-line-pen" width={24} height={24} />
                <SizeSlider
                  value={size}
                  onChange={(size) => {
                    setSize(size);
                  }}
                  max={80}
                  min={1}
                  step={1}
                />
              </div>
              <Divider orientation="vertical" className={styles.Divider} />
            </>
          )}

          {!isIcon && (
            <>
              <div
                className={classNames(fill && styles.active, styles.toolButton)}
                onClick={() => {
                  setFill((pre) => !pre);
                }}
              >
                <Icon symbol="image-clip-shape-fill" width={24} height={24} />
              </div>
              <Divider orientation="vertical" className={styles.Divider} />
            </>
          )}
          <ColorList
            colorType="fill"
            colors={colors}
            color={color}
            onClick={setColor}
          />
        </div>
      }
      open={open}
      // onOpenChange={onOpenChange}
    >
      <div
        className={classNames(
          (activeTool === type || open) && styles.active,
          styles.toolButton,
        )}
        onClick={() => {
          onChangeTool(type);

          const isActive = activeTool !== type;
          if (isActive) {
            imageEditor.stopDrawingMode();
            imageEditor.discardSelection();
            imageEditor.changeSelectableAll(false);

            if (isIcon) {
              imageEditor.startDrawingMode("ICON");
              imageEditor.setDrawingIcon(type, color);
            } else {
              imageEditor.startDrawingMode("SHAPE");
              imageEditor.setDrawingShape(type, {
                stroke: color,
                fill: fill ? color : "",
                strokeWidth: size,
              });
            }
          } else {
            imageEditor.stopDrawingMode();
            imageEditor.discardSelection();
            imageEditor.changeSelectableAll(true);
          }
        }}
      >
        {ToolIcon}
      </div>
    </Popover>
  );
};
const TextDrawMenu: React.FC<{
  colors?: string[];
  fonts?: number[];
  activeTool: ToolID | undefined;
  onChangeTool: (tool: ToolID | undefined) => void;
  imageEditor: ImageEditor;
}> = ({
  colors = PickColors,
  imageEditor,
  activeTool,
  onChangeTool,
  fonts = [12, 16, 20, 24, 32, 36, 40, 48, 64, 72, 80, 96],
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(activeTool === "text");
  }, [activeTool]);
  const [size, setSize] = useState<number>(12);
  const [bold, setBold] = useState(false);

  const [color, setColor] = useState(colors?.[0]);

  useEffect(() => {
    const onAddText = (pos: any) => {
      imageEditor
        .addText("", {
          position: pos.originPosition,
          styles: {
            fill: color,
            fontSize: size,
            fontFamily: "Noto Sans",
            fontStyle: "normal",
            fontWeight: bold ? "bold" : "normal",
          },
        })
        .then(() => {
          imageEditor.changeCursor("default");
        });
    };
    imageEditor?.on("addText", onAddText);
    return () => {
      imageEditor?.off("addText", onAddText);
    };
  }, [imageEditor, size, color, bold]);

  return (
    <Popover
      styles={{
        container: {
          padding: 0,
        },
      }}
      classNames={{
        root: styles.Popover,
      }}
      trigger={"click"}
      zIndex={100}
      placement="bottom"
      content={
        <div className={styles.FreeDrawMenu}>
          <div
            className={classNames(bold && styles.active, styles.toolButton)}
            onClick={() => {
              setBold((pre) => !pre);
            }}
          >
            <Icon symbol="image-clip-text-bold" width={24} height={24} />
          </div>
          <Divider orientation="vertical" className={styles.Divider} />
          <Select
            value={size}
            options={fonts.map((item) => ({
              label: `${item}px`,
              value: item,
            }))}
            onChange={(size) => {
              setSize(size);
            }}
          />
          <Divider orientation="vertical" className={styles.Divider} />
          <ColorList
            colorType="fill"
            colors={colors}
            color={color}
            onClick={setColor}
          />
        </div>
      }
      open={open}
    >
      <div
        className={classNames(
          (activeTool === "text" || open) && styles.active,
          styles.toolButton,
        )}
        onClick={() => {
          onChangeTool("text");

          const isActive = activeTool !== "text";
          if (isActive) {
            imageEditor.stopDrawingMode();
            imageEditor.discardSelection();
            imageEditor.changeSelectableAll(false);
            imageEditor.startDrawingMode("TEXT");
          } else {
            imageEditor.stopDrawingMode();
            imageEditor.discardSelection();
            imageEditor.changeSelectableAll(true);
          }
        }}
      >
        {activeTool === "text" ? (
          <Icon symbol="image-clip-text-active" width={24} height={24} />
        ) : (
          <Icon symbol="image-clip-text" width={24} height={24} />
        )}
      </div>
    </Popover>
  );
};

const ClipDrawMenu: React.FC<{
  activeTool: ToolID | undefined;
  onChangeTool: (tool: ToolID | undefined) => void;
  imageEditor: ImageEditor;
}> = ({ imageEditor, activeTool, onChangeTool }) => {
  const [open, setOpen] = useState(false);
  const [ratio, setRatio] = useState<number | undefined>(ratios[0].value);

  useEffect(() => {
    setOpen(activeTool === "clip");

    if (activeTool !== "clip") {
      setRatio(undefined);
    } else {
      setRatio(ratios[0].value);
    }
  }, [activeTool]);

  return (
    <Popover
      styles={{
        container: {
          padding: 0,
        },
      }}
      classNames={{
        root: styles.Popover,
      }}
      trigger={"click"}
      zIndex={100}
      placement="bottom"
      content={
        <div className={styles.ClipDrawMenu}>
          {ratios.map((item) => (
            <div
              className={classNames(
                ratio === item.value && styles.active,
                styles.ratioButton,
              )}
              onClick={() => {
                setRatio(item.value);
                imageEditor.setCropzoneRect(item.value);
              }}
              key={item.value}
            >
              {item.label}
            </div>
          ))}
        </div>
      }
      open={open}
    >
      <div
        className={classNames(
          (activeTool === "clip" || open) && styles.active,
          styles.toolButton,
        )}
        onClick={() => {
          onChangeTool("clip");

          const isActive = activeTool !== "clip";
          if (isActive) {
            imageEditor.stopDrawingMode();
            imageEditor.discardSelection();
            imageEditor.changeSelectableAll(false);
            imageEditor.startDrawingMode("CROPPER");
            imageEditor.setCropzoneRect(ratios[0].value);
          } else {
            imageEditor.stopDrawingMode();
            imageEditor.discardSelection();
            imageEditor.changeSelectableAll(true);
          }
        }}
      >
        {activeTool === "clip" ? (
          <Icon symbol="image-clip-crop-active" width={24} height={24} />
        ) : (
          <Icon symbol="image-clip-crop" width={24} height={24} />
        )}
      </div>
    </Popover>
  );
};

const DrawingBoard: React.FC = () => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<ImageEditor | null>(null);
  const [tool, setTool] = useState<ToolID>();
  const [editor, setEditor] = useState<ImageEditor | null>(null);

  const [undoable, setUndoable] = useState(false);
  const [redoable, setRedoable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (editorInstanceRef.current) return;
    setIsLoading(true);
    const editorInstance = new ImageEditor(editorContainerRef.current, {
      includeUI: {
        loadImage: {
          path: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400",
          name: "SampleImage",
        },
        theme: {
          "common.bi.image": "", // 隐藏右上角 Logo
          "common.bisize.width": "0",
          "common.bisize.height": "0",
        },
        menu: [
          "filter",
          "draw",
          "text",
          "mask",
          "icon",
          "shape",
          "crop",
          "flip",
          "rotate",
        ],
        initMenu: "filter",
        uiSize: {
          width: "100%",
          height: "700px",
        },
        menuBarPosition: "bottom",
      },
      // includeUI: false,
      // cssMaxWidth: 700,
      // cssMaxHeight: 500,
      // selectionStyle: {
      //   cornerSize: 20,
      //   rotatingPointOffset: 70,
      // },
    });
    editorInstance
      .loadImageFromURL(
        "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400",
        "12",
      )
      .then(() => {
        editorInstance.clearUndoStack();
        setIsLoading(false);
      });
    editorInstanceRef.current = editorInstance;

    editorInstance.registerIcons({
      arrow: "M40 12V0l24 24-24 24V36H0V12h40z",
    });

    editorInstance.on("addObjectAfter", () => {
      editorInstance?.changeCursor("default");
    });
    setEditor(editorInstance);
    // 组件卸载时销毁实例
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.off();
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const imageEditor = editorInstanceRef.current!;

    imageEditor.on("undoStackChanged", (undoLength: number) => {
      console.log("undoLength", undoLength);
      setUndoable(undoLength > 0);
    });

    imageEditor.on("redoStackChanged", (redoLength: number) => {
      console.log("redoLength", redoLength);
      setRedoable(redoLength > 0);
    });
  }, []);

  const onUndo = () => {
    const imageEditor = editorInstanceRef.current!;
    imageEditor.undo();
  };

  const onRedo = () => {
    const imageEditor = editorInstanceRef.current!;
    imageEditor.redo();
  };

  const onChangeTool = (tool: ToolID | undefined) => {
    setTool((pre) => {
      if (pre === tool) {
        return undefined;
      }
      return tool;
    });
  };
  const tools = [
    {
      id: "undo",
      content: undoable ? (
        <Icon
          symbol="image-clip-undo-active"
          width={24}
          height={24}
          onClick={onUndo}
        />
      ) : (
        <Icon symbol="image-clip-undo" width={24} height={24} disabled />
      ),
    },
    {
      id: "redo",
      content: redoable ? (
        <Icon
          symbol="image-clip-redo-active"
          width={24}
          height={24}
          onClick={onRedo}
        />
      ) : (
        <Icon symbol="image-clip-redo" width={24} height={24} disabled />
      ),
    },
    {
      id: "divider1",
      content: <Divider orientation="vertical" className={styles.Divider1} />,
    },
    {
      id: "free",
      content: (
        <FreeDrawMenu
          activeTool={tool}
          imageEditor={editor!}
          onChangeTool={onChangeTool}
        />
      ),
    },
    {
      id: "divider2",
      content: <Divider orientation="vertical" className={styles.Divider1} />,
    },
    {
      id: "rect",
      content: (
        <ShapeDrawMenu
          type="rect"
          activeTool={tool}
          imageEditor={editor!}
          onChangeTool={onChangeTool}
        />
      ),
    },
    {
      id: "circle",
      content: (
        <ShapeDrawMenu
          type="circle"
          activeTool={tool}
          imageEditor={editor!}
          onChangeTool={onChangeTool}
        />
      ),
    },
    {
      id: "divider3",
      content: <Divider orientation="vertical" className={styles.Divider1} />,
    },
    {
      id: "arrow",
      content: (
        <ShapeDrawMenu
          type="arrow"
          activeTool={tool}
          imageEditor={editor!}
          onChangeTool={onChangeTool}
        />
      ),
    },
    {
      id: "divider4",
      content: <Divider orientation="vertical" className={styles.Divider1} />,
    },
    {
      id: "text",
      content: (
        <TextDrawMenu
          activeTool={tool}
          imageEditor={editor!}
          onChangeTool={onChangeTool}
        />
      ),
    },
    {
      id: "divider5",
      content: <Divider orientation="vertical" className={styles.Divider1} />,
    },
    {
      id: "clip",
      content: (
        <ClipDrawMenu
          activeTool={tool}
          imageEditor={editor!}
          onChangeTool={onChangeTool}
        />
      ),
    },
  ] as const;

  const [preview, setpreview] = useState();
  return (
    <>
      <FileUpload
        onFileSelect={(file) => {
          const imageEditor = editorInstanceRef.current!;
          imageEditor.loadImageFromFile(file, "test");
        }}
      />
      <div className={styles.DrawingBoard}>
        {tool === "clip" && (
          <div className={styles.clipButtons}>
            <Button
              icon={
                <Icon symbol="image-clip-crop-close" width={18} height={18} />
              }
              onClick={() => {
                const imageEditor = editorInstanceRef.current!;
                onChangeTool(undefined);
                imageEditor?.stopDrawingMode();
                imageEditor?.discardSelection();
                imageEditor?.changeSelectableAll(true);
              }}
              className={classNames(styles.clipButton, styles.close)}
            >
              取消
            </Button>
            <Button
              icon={
                <Icon symbol="image-clip-crop-apply" width={18} height={18} />
              }
              onClick={() => {
                const imageEditor = editorInstanceRef.current!;
                const cropRect = imageEditor?.getCropzoneRect();
                if (cropRect && !isEmptyCropzone(cropRect)) {
                  imageEditor
                    .crop(cropRect)
                    .then(() => {
                      imageEditor.stopDrawingMode();
                    })
                    .catch((message) => Promise.reject(message))
                    .finally(() => {
                      onChangeTool(undefined);
                    });
                } else {
                  onChangeTool(undefined);
                  imageEditor?.stopDrawingMode();
                  imageEditor?.discardSelection();
                  imageEditor?.changeSelectableAll(true);
                }
              }}
              className={classNames(styles.clipButton, styles.apply)}
            >
              应用
            </Button>
          </div>
        )}
        <div className={styles.editor} ref={editorContainerRef}></div>
        {!isLoading && (
          <div className={styles.footer}>
            <div className={styles.toolWrapper}>
              {tools.map((item) => (
                <React.Fragment key={item.id}>{item?.content}</React.Fragment>
              ))}
            </div>

            <Button
              onClick={() => {
                const imageEditor = editorInstanceRef.current!;

                const data = imageEditor?.toDataURL();

                setpreview(data);
                console.log("data", data);
              }}
            >
              保存
            </Button>
          </div>
        )}
      </div>

      {preview && (
        <img
          src={preview}
          style={{ width: 200, height: 200, objectFit: "contain" }}
        />
      )}
    </>
  );
};

export { DrawingBoard };
