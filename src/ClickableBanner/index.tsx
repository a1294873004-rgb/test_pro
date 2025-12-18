import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "./index.module.less";
import { Icon } from "src/components/Icon";
import { animate, createTimeline } from "animejs";
import classNames from "classnames";
interface ClickableBannerProps {
  containerWidth?: number;
}
type Direction = "left" | "right";

interface IncomingAndOutgoing {
  incomingIndex: number;
  outgoingIndex: number;
}
/**
 * 计算轮播最新进来的图和被删除的图索引（current 已是新的中间索引）
 */
function getIncomingAndOutgoingIndex(
  current: number,
  direction: Direction,
  total: number
): IncomingAndOutgoing {
  if (total <= 0) return { incomingIndex: -1, outgoingIndex: -1 };

  if (direction === "left") {
    return {
      incomingIndex: (current - 1 + total) % total, // 最新进来的右边
      outgoingIndex: (current + 2 + total) % total, // 删除的左边
    };
  } else if (direction === "right") {
    return {
      incomingIndex: (current + 1) % total, // 最新进来的左边
      outgoingIndex: (current - 2 + total) % total, // 删除的右边
    };
  } else {
    throw new Error("Invalid direction");
  }
}

const ClickableBanner: React.FC<ClickableBannerProps> = ({
  containerWidth = 1280,
}) => {
  const isAnimating = useRef(false);
  const currentRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const imgRefs = useRef<HTMLDivElement[]>([]);
  const imgs = [
    {
      url: "https://scdn.yidooo.com/yd_sys/web/front_end_oss_data/1765541715923_7f47.png",
      text: "Create stunning images with AI",
    },
    {
      url: "https://scdn.yidooo.com/yd_sys/web/front_end_oss_data/1765541715926_2684.png",
      text: "Transform your ideas into visuals",
    },
    {
      url: "https://scdn.yidooo.com/yd_sys/web/front_end_oss_data/1765541715928_509f.png",
      text: "Unleash creativity with every click",
    },
    {
      url: "https://scdn.yidooo.com/yd_sys/web/front_end_oss_data/1765541715918_6491.png",
      text: "AI-powered image generation made easy",
    },
    {
      url: "https://scdn.yidooo.com/yd_sys/web/front_end_oss_data/1765541715918_6491.png",
      text: "AI-powered image generation made easy",
    },
  ];
  const total = imgs.length;
  const addToRefs = (el: HTMLDivElement) => {
    if (el && !imgRefs.current.includes(el)) {
      imgRefs.current.push(el);
    }
  };

  const imgWidth = 880;
  const scaleImgWidth = 756;
  const gap = 20;
  const scale = scaleImgWidth / imgWidth;
  const duration = 1000;
  const ease = "inOut(3)";
  const baseX = (containerWidth - imgWidth) / 2;

  useLayoutEffect(() => {
    animateHandler("right");
  }, []);

  const animateHandler = useCallback(
    (direction: Direction) => {
      if (!imgRefs.current.length) return;
      currentRef.current =
        direction === "left"
          ? (currentRef.current - 1 + total) % total
          : (currentRef.current + 1) % total;
      const current = currentRef.current;
      const { incomingIndex, outgoingIndex } = getIncomingAndOutgoingIndex(
        current,
        direction,
        total
      );
      setCurrentIndex(current);

      const leftIndex = (current - 1 + total) % total;
      const rightIndex = (current + 1) % total;

      const tl = createTimeline({
        onBegin: () => {
          isAnimating.current = true;
        },
        onComplete: () => {
          // 隐藏被删除的图片
          // outgoingItem.style.display = "none";
          isAnimating.current = false;
        },
      });

      imgRefs.current.forEach((el, index) => {
        if (index === current) {
          // 中间图
          tl.add(
            el,
            {
              transform: [
                {
                  to: `translateX(${baseX}px) scale(${1})`,
                  ease,
                  duration,
                },
              ],
            },
            0
          );
        } else if (index === leftIndex) {
          // 左边图,这张图是新的
          if (direction === "left") {
            tl.add(
              el,
              {
                transform: [
                  {
                    from: `translateX(${baseX - scaleImgWidth * 2 - gap * 2}px) scale(${scale})`,
                    to: `translateX(${baseX - (scaleImgWidth + gap)}px) scale(${scale})`,
                    ease,
                    duration,
                  },
                ],
                onBegin() {
                  el.style.display = "block";
                },
              },
              0
            );
          } else {
            tl.add(
              el,
              {
                transform: [
                  {
                    to: `translateX(${baseX - (scaleImgWidth + gap)}px) scale(${scale})`,
                    ease,
                    duration,
                  },
                ],
              },
              0
            );
          }
        } else if (index === rightIndex) {
          // 右边图
          if (direction === "left") {
            tl.add(
              el,
              {
                transform: [
                  {
                    to: `translateX(${imgWidth + gap + baseX}px) scale(${scale})`,
                    ease,
                    duration,
                  },
                ],
              },
              0
            );
          } else {
            tl.add(
              el,
              {
                transform: [
                  {
                    from: `translateX(${scaleImgWidth + imgWidth + gap * 2 + baseX}px) scale(${scale})`,
                    to: `translateX(${imgWidth + gap + baseX}px) scale(${scale})`,
                    ease,
                    duration,
                  },
                ],
                onBegin() {
                  // 向右滑，最新进来的是左边的图
                  // incomingItem.style.transform =;
                  el.style.display = "block";
                },
              },
              0
            );
          }
        } else if (index === outgoingIndex) {
          const outgoingX =
            direction === "left"
              ? baseX + imgWidth + scaleImgWidth + gap * 2
              : baseX - scaleImgWidth * 2 - gap * 2;
          // 删除的图片
          tl.add(
            el,
            {
              transform: [
                {
                  to: `translateX(${outgoingX}px) scale(${scale})`,
                  ease,
                  duration,
                },
              ],
              onComplete() {
                el.style.display = "none";
              },
            },
            0
          );
        } else {
          el.style.display = "none";
        }
      });
    },
    [imgs.length]
  );

  return (
    <div className={styles.bannerContainer}>
      <button
        width={48}
        height={48}
        onClick={() => {
          animateHandler("left");
        }}
        className={classNames(styles.bannerBtn, styles.left)}
      >
        left
      </button>
      {imgs.map(({ url }, index) => (
        <div
          key={url}
          ref={addToRefs}
          className={classNames(styles.bannerSliderItem)}
        >
          <div
            style={{
              position: "absolute",
              fontSize: 30,
              color: "red",
            }}
          >
            {index}
          </div>
          <img src={url} alt={`banner-${index}`} />
        </div>
      ))}

      <div
        className={styles.dotsContainer}
        style={{
          left: baseX + 40,
        }}
      >
        {imgs.map((_, i) => (
          <div
            key={i}
            className={classNames(
              styles.dot,
              i === currentIndex && styles.active
            )}
          />
        ))}
      </div>
      <button
        width={48}
        height={48}
        onClick={() => {
          animateHandler("right");
        }}
        className={classNames(styles.bannerBtn, styles.right)}
      >
        right
      </button>
    </div>
  );
};

export { ClickableBanner };
