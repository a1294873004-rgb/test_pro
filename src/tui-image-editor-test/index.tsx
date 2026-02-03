import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
// import ImageEditor from "tui-image-editor";
import ImageEditor from "./libs/image-editor/src/index.js";
import "tui-image-editor/dist/tui-image-editor.css";
import styles from "./index.module.less";

import classNames from "classnames";
import { Popover, Select, Slider, Splitter } from "antd";
import { SliderProps } from "antd/es/slider/index.js";

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

const emptyCropRectValues = {
  LEFT: 0,
  TOP: 0,
  WIDTH: 0.5,
  HEIGHT: 0.5,
};

// import "tui-code-snippet/dist/tui-code-snippet.css";
function isEmptyCropzone(cropRect: any) {
  const { left, top, width, height } = cropRect;
  const { LEFT, TOP, WIDTH, HEIGHT } = emptyCropRectValues;

  return left === LEFT && top === TOP && width === WIDTH && height === HEIGHT;
}

const getRandomInt = (min: number, max: number): number => {
  // 确保参数为整数
  min = Math.ceil(min);
  max = Math.floor(max);

  // 公式：Math.random() * (最大值 - 最小值 + 1) + 最小值
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const getRandomHex = (): string => {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`;
};

const SizeSlider: React.FC<SliderProps> = (props) => {
  return <Slider {...props} className={styles.slider} />;
};
type ColorType = "stroke" | "fill";
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
const FreeDrawMenu: React.FC<{
  colors?: string[];
  activeTool: ToolID | undefined;
  onChangeTool: (tool: ToolID | undefined) => void;
  imageEditor: ImageEditor;
}> = ({ colors = PickColors, imageEditor, activeTool, onChangeTool }) => {
  const [open, setOpen] = useState(false);
  const onOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
  }, []);
  const [size, setSize] = useState<number>(20);
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
              L
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
              F
            </div>
            <SizeSlider
              value={size}
              onChange={(size) => {
                setSize(size);
              }}
              max={100}
              min={10}
              step={1}
            />
          </div>

          <Splitter vertical />
          <ColorList
            colorType="fill"
            colors={colors}
            color={color}
            onClick={setColor}
          />
        </div>
      }
      open={open}
      onOpenChange={onOpenChange}
    >
      <div
        className={classNames(
          (["free", "line"].includes(activeTool) || open) && styles.active,
          styles.toolButton,
        )}
      >
        D
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
  const onOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
  }, []);
  const [size, setSize] = useState<number>(20);
  const [fill, setFill] = useState(false);
  const [color, setColor] = useState(colors?.[0]);
  const isIcon = type === "arrow";
  useEffect(() => {
    if (type === activeTool) {
      if (isIcon) {
        imageEditor.startDrawingMode("ICON");
        imageEditor.setDrawingIcon(type, color);
      } else {
        imageEditor.startDrawingMode("SHAPE");
        imageEditor.setDrawingShape(type, {
          stroke: color,
          fill: fill ? color : "",
          strokeWidth: getRandomInt(2, 20),
        });
      }
    }
  }, [activeTool, size, color, type, fill, isIcon]);

  return (
    <Popover
      styles={{
        container: {
          padding: 0,
        },
      }}
      trigger={"click"}
      zIndex={100}
      placement="bottom"
      content={
        <div className={styles.FreeDrawMenu}>
          {!isIcon && (
            <div className={styles.left}>
              <SizeSlider
                value={size}
                onChange={(size) => {
                  setSize(size);
                }}
                max={100}
                min={10}
                step={1}
              />
            </div>
          )}

          <Splitter vertical />
          {!isIcon && (
            <>
              <div
                className={classNames(fill && styles.active, styles.toolButton)}
                onClick={() => {
                  setFill((pre) => !pre);
                }}
              />
              <Splitter vertical />
            </>
          )}
          <ColorList
            colorType="stroke"
            colors={colors}
            color={color}
            onClick={setColor}
          />
        </div>
      }
      open={open}
      onOpenChange={onOpenChange}
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
                strokeWidth: getRandomInt(2, 20),
              });
            }
          } else {
            imageEditor.stopDrawingMode();
            imageEditor.discardSelection();
            imageEditor.changeSelectableAll(true);
          }
        }}
      >
        {type.slice(0, 1)}
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
  fonts = new Array(100).fill(0).map((_, index) => index + 5),
}) => {
  const [open, setOpen] = useState(false);
  const onOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
  }, []);
  const [size, setSize] = useState<number>(20);
  const [bold, setBold] = useState(false);

  const [color, setColor] = useState(colors?.[0]);

  useEffect(() => {
    const onAddText = (pos) => {
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

  console.log("fonts", fonts);
  return (
    <Popover
      styles={{
        container: {
          padding: 0,
        },
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
          />
          <Splitter vertical />
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
          <Splitter vertical />
          <ColorList
            colorType="fill"
            colors={colors}
            color={color}
            onClick={setColor}
          />
        </div>
      }
      open={open}
      onOpenChange={onOpenChange}
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
        {"text".slice(0, 1)}
      </div>
    </Popover>
  );
};

const ClipDrawMenu: React.FC<{
  activeTool: ToolID | undefined;
  onChangeTool: (tool: ToolID | undefined) => void;
  imageEditor: ImageEditor;
  ratios?: { label: string; value: number }[];
}> = ({
  imageEditor,
  activeTool,
  onChangeTool,
  ratios = [
    {
      label: "1:1",
      value: 1,
    },
    {
      label: "16:9",
      value: 16 / 9,
    },
    {
      label: "9:16",
      value: 9 / 16,
    },
    {
      label: "4:3",
      value: 4 / 3,
    },
    {
      label: "3:4",
      value: 3 / 4,
    },
    {
      label: "21:9",
      value: 21 / 9,
    },
  ],
}) => {
  const [open, setOpen] = useState(false);
  const [ratio, setRatio] = useState<number | undefined>(ratios[0].value);

  const onOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
  }, []);

  return (
    <Popover
      styles={{
        container: {
          padding: 0,
        },
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
            >
              {item.label}
            </div>
          ))}

          <div
            className={styles.toolButton}
            onClick={() => {
              const cropRect = imageEditor.getCropzoneRect();
              if (cropRect && !isEmptyCropzone(cropRect)) {
                imageEditor
                  .crop(cropRect)
                  .then(() => {
                    imageEditor.stopDrawingMode();
                  })
                  .catch((message) => Promise.reject(message))
                  .finally(() => {
                    setRatio(undefined);
                    onChangeTool(undefined);
                    setOpen(false);
                  });
              }
            }}
          >
            apply
          </div>
        </div>
      }
      open={open}
      onOpenChange={onOpenChange}
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
        {"clip".slice(0, 1)}
      </div>
    </Popover>
  );
};
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
    // 初始化编辑器实例
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
      includeUI: false,
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
    setEditor(editorInstance);
    // 组件卸载时销毁实例
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, []);

  const preToolRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const imageEditor = editorInstanceRef.current!;

    imageEditor.registerIcons({
      arrow: "M40 12V0l24 24-24 24V36H0V12h40z",
    });
    imageEditor.on("addText", (pos) => {
      imageEditor
        .addText("", {
          position: pos.originPosition,
          styles: {
            fill: getRandomHex(),
            fontSize: getRandomInt(2, 100),
            fontFamily: "Noto Sans",
            fontStyle: "normal",
            fontWeight: "normal",
          },
        })
        .then(() => {
          imageEditor.changeCursor("default");
        });
    });
  }, []);
  const onClickTool = (toolName: string) => {
    const preToolName = preToolRef.current;

    const actions = editorInstance.current.getActions();
    console.log("actions", toolName, preToolName);
    const imageEditor = editorInstance.current!;

    if (toolName === "free") {
      if (preToolName === toolName) {
        imageEditor.discardSelection();
        imageEditor.changeSelectableAll(true);
        imageEditor.changeSelectableAll(true);
        imageEditor.stopDrawingMode();
      } else {
        imageEditor.discardSelection();
        imageEditor.changeSelectableAll(true);

        imageEditor.stopDrawingMode();

        imageEditor.startDrawingMode("FREE_DRAWING", {
          width: getRandomInt(2, 20),
          color: getRandomHex(),
        });
      }
    } else if (toolName === "line") {
      if (preToolName === toolName) {
        imageEditor.discardSelection();
        imageEditor.changeSelectableAll(true);
        imageEditor.changeSelectableAll(true);
        imageEditor.stopDrawingMode();
      } else {
        imageEditor.discardSelection();
        imageEditor.changeSelectableAll(true);

        imageEditor.stopDrawingMode();

        imageEditor.startDrawingMode("LINE_DRAWING", {
          width: getRandomInt(2, 20),
          color: getRandomHex(),
        });
      }
    } else if (toolName === "rect") {
      if (preToolName === toolName) {
        // reset
        imageEditor.stopDrawingMode();
        imageEditor.discardSelection();
        imageEditor.changeSelectableAll(true);
      } else {
        // reset
        imageEditor.stopDrawingMode();
        imageEditor.discardSelection();
        imageEditor.changeSelectableAll(true);
        //init
        imageEditor.changeSelectableAll(false);
        imageEditor.startDrawingMode("SHAPE");
        imageEditor.setDrawingShape("rect", {
          stroke: getRandomHex(),
          fill: "",
          strokeWidth: getRandomInt(2, 20),
        });
      }
    } else if (toolName === "circle") {
      if (preToolName === toolName) {
        // reset
        imageEditor.stopDrawingMode();
        imageEditor.discardSelection();
        imageEditor.changeSelectableAll(true);
      } else {
        // reset
        imageEditor.stopDrawingMode();
        imageEditor.discardSelection();
        imageEditor.changeSelectableAll(true);
        //init
        imageEditor.changeSelectableAll(false);
        imageEditor.startDrawingMode("SHAPE");
        imageEditor.setDrawingShape("circle", {
          stroke: getRandomHex(),
          fill: "",
          strokeWidth: getRandomInt(2, 20),
        });
      }
    } else if (toolName === "text") {
      if (preToolName === toolName) {
        // reset
        imageEditor.stopDrawingMode();
        imageEditor.discardSelection();
        imageEditor.changeSelectableAll(true);
      } else {
        // reset
        imageEditor.stopDrawingMode();
        imageEditor.discardSelection();
        imageEditor.changeSelectableAll(true);
        //init
        imageEditor.changeSelectableAll(false);
        imageEditor.startDrawingMode("TEXT");
        // imageEditor.setDrawingShape("circle", {
        //   stroke: getRandomHex(),
        //   fill: "",
        //   strokeWidth: getRandomInt(2, 20),
        // });
      }
    } else if (toolName === "clip") {
      if (preToolName === toolName) {
        // reset
        imageEditor.stopDrawingMode();
        imageEditor.discardSelection();
        imageEditor.changeSelectableAll(true);
      } else {
        // reset
        imageEditor.stopDrawingMode();
        imageEditor.discardSelection();
        imageEditor.changeSelectableAll(true);
        //init
        imageEditor.changeSelectableAll(false);
        imageEditor.startDrawingMode("CROPPER");
        // imageEditor.setDrawingShape("circle", {
        //   stroke: getRandomHex(),
        //   fill: "",
        //   strokeWidth: getRandomInt(2, 20),
        // });
      }
    }
  };

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
  const tools = [
    {
      id: "undo",
      icon: "",
      onClick: () => {
        const imageEditor = editorInstanceRef.current!;
        imageEditor.undo();
      },
      className: !undoable && styles.disabled,
    },
    {
      id: "redo",
      icon: "",
      onClick: () => {
        const imageEditor = editorInstanceRef.current!;
        imageEditor.redo();
      },
      className: !redoable && styles.disabled,
    },
    {
      id: "free",
      icon: "",
      onClick: () => {},
      content: (
        <FreeDrawMenu
          activeTool={tool}
          imageEditor={editor!}
          onChangeTool={(tool) => {
            setTool((pre) => {
              if (pre === tool) {
                return undefined;
              }
              return tool;
            });
          }}
        />
      ),
    }, //ShapeDrawMenu
    {
      id: "rect",
      icon: "",
      content: (
        <ShapeDrawMenu
          type="rect"
          activeTool={tool}
          imageEditor={editor!}
          onChangeTool={(tool) => {
            setTool((pre) => {
              if (pre === tool) {
                return undefined;
              }
              return tool;
            });
          }}
        />
      ),
    },
    {
      id: "circle",
      icon: "",
      onClick: () => {},
      content: (
        <ShapeDrawMenu
          type="circle"
          activeTool={tool}
          imageEditor={editor!}
          onChangeTool={(tool) => {
            setTool((pre) => {
              if (pre === tool) {
                return undefined;
              }
              return tool;
            });
          }}
        />
      ),
    },
    {
      id: "arrow",
      icon: "",
      onClick: () => {},
      content: (
        <ShapeDrawMenu
          type="arrow"
          activeTool={tool}
          imageEditor={editor!}
          onChangeTool={(tool) => {
            setTool((pre) => {
              if (pre === tool) {
                return undefined;
              }
              return tool;
            });
          }}
        />
      ),
    }, //TextDrawMenu
    {
      id: "text",
      icon: "",
      content: (
        <TextDrawMenu
          activeTool={tool}
          imageEditor={editor!}
          onChangeTool={(tool) => {
            setTool((pre) => {
              if (pre === tool) {
                return undefined;
              }
              return tool;
            });
          }}
        />
      ),
    }, //ClipDrawMenu
    {
      id: "clip",
      icon: "",
      content: (
        <ClipDrawMenu
          activeTool={tool}
          imageEditor={editor!}
          onChangeTool={(tool) => {
            setTool((pre) => {
              if (pre === tool) {
                return undefined;
              }
              return tool;
            });
          }}
        />
      ),
    },
  ] as const;
  return (
    <>
      <FileUpload
        onFileSelect={(file) => {
          const imageEditor = editorInstanceRef.current!;
          imageEditor.loadImageFromFile(file, "test");
        }}
      />
      <div className={styles.DrawingBoard}>
        {tool === "clip" && false && (
          <div
            className={styles.clipButton}
            onClick={() => {
              const imageEditor = editorInstanceRef.current!;

              const cropRect = imageEditor.getCropzoneRect();
              if (cropRect && !isEmptyCropzone(cropRect)) {
                imageEditor
                  .crop(cropRect)
                  .then(() => {
                    imageEditor.stopDrawingMode();
                    // imageEditor.ui.resizeEditor();
                    // imageEditor.ui.changeMenu("crop");
                    // imageEditor._invoker.fire(
                    //   eventNames.EXECUTE_COMMAND,
                    //   historyNames.CROP,
                    // );
                  })
                  ["catch"]((message) => Promise.reject(message));
              }
            }}
          >
            crop
          </div>
        )}

        <div className={styles.editor} ref={editorContainerRef}></div>
        <div className={styles.footer}>
          <div className={styles.toolWrapper}>
            {tools.map((item) => {
              return (
                item?.content ?? (
                  <div
                    onClick={item.onClick}
                    key={item.id}
                    className={classNames(styles.toolButton, item.className)}
                  >
                    {item.id.slice(0, 1)}
                  </div>
                )
              );
            })}
          </div>

          <button>保存</button>
        </div>
      </div>
    </>
  );
};

export { DrawingBoard };
