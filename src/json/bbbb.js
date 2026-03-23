const p1 = {
  audience_analysis: {
    creative_context: {
      media_type: "Text",
      platform_focus: "YouTube Shorts",
      target_objective: "涨粉流量 (Follower Growth & Traffic)",
      analysis_summary:
        "在YouTube Shorts的算法推荐体系中，纯文字素材往往需要搭配强有力的视觉背景或极具吸引力的标题来获取搜索关键词（SEO）的命中率。当前提供的文字内容'1111111111222222222'完全缺乏有意义的信息密度，无法在黄金前3秒内为观众提供明确的利益点或悬念。Shorts受众期待在短时间内获得完整的逻辑闭环或高密度的娱乐价值，而这种无意义的字符堆砌会导致极高的滑走率（Swipe-away rate）。算法会迅速将其判定为低质量或垃圾内容，从而停止流量推荐。对于涨粉和获取公域流量的目标而言，此素材是完全无效的，建议结合具体的行业痛点或引人注目的冷知识进行重构，以符合Shorts平台对信息密度的要求。",
    },
    score_distribution: {
      plan_a: {
        dots: 2,
        color: "#FFD700",
        label: "喜欢",
      },
      plan_b: {
        dots: 0,
        color: "#4169E1",
        label: "无",
      },
      plan_c: {
        dots: 98,
        color: "#D3D3D3",
        label: "不喜欢",
      },
    },
    winner_stats: {
      winner_label: "不喜欢",
      winning_rate: "98%",
    },
    typical_audiences: [
      {
        name: "Gen Z 快刷党 (13-24岁)",
        tags: ["极低耐心", "多巴胺驱动", "快速滑走"],
        description:
          "习惯了高信息密度和强视觉刺激的Shorts内容。看到毫无意义的数字堆砌，会在0.5秒内毫不犹豫地划走，甚至可能会顺手点击'不感兴趣'。",
      },
      {
        name: "千禧一代打工人 (25-44岁)",
        tags: ["寻找价值", "逻辑导向", "困惑不解"],
        description:
          "在碎片时间浏览Shorts以获取资讯或放松。面对这串数字，他们会感到困惑，认为这是系统Bug或是垃圾账号的测试内容，无法产生任何品牌信任或关注欲望。",
      },
      {
        name: "中老年保守受众 (45岁+)",
        tags: ["内容慢消化", "警惕性高", "反感无意义"],
        description:
          "对社交媒体上的异常内容保持警惕。这串看似乱码的数字会让他们觉得莫名其妙甚至具有欺诈风险，绝对不会转化为粉丝，反而会留下极差的印象。",
      },
    ],
  },
  platform: "shorts",
  target_age_groups: ["45-54", "13-17", "18-24", "55+", "25-34", "35-44"],
  target_gender: "no_preference",
};

const p2 = {
  diagnostics_analysis: {
    media_identity: {
      detected_type: "Text",
      target_platform: "YouTube Shorts",
      target_objective: "Follower Growth and Traffic",
      media_characteristic:
        "Repetitive numerical string lacking semantic meaning or context",
    },
    platform_trend_analysis: {
      current_trends:
        "YouTube Shorts audiences currently favor high information density, quick educational tips, satisfying loops, and strong narrative hooks that keep them watching until the end to boost retention rates.",
      integration_strategy:
        "For text-based Shorts, the text must either drive a compelling Text-To-Speech (TTS) narrative or serve as high-contrast, fast-paced kinetic typography that visually hooks the viewer while delivering a clear punchline or fact.",
    },
    diagnostics_report: [
      {
        plan_label: "Text Content 1",
        winner: false,
        winning_rate: "1%",
        radar_data: {
          hook_3s: {
            score: 5,
            benchmark: 80,
            dimension_name: "3-Second Hook",
          },
          rhythm_visual: {
            score: 5,
            benchmark: 75,
            dimension_name: "Information Rhythm",
          },
          native_feel: {
            score: 10,
            benchmark: 85,
            dimension_name: "Platform Native Feel",
          },
          cta_strength: {
            score: 0,
            benchmark: 70,
            dimension_name: "Call-to-Action Strength",
          },
        },
        improvement_advice: {
          text_specific:
            "Replace the meaningless numbers with a strong hook like 'Did you know...' or a relatable question. Add emojis to break up the text and guide the viewer's eye.",
          image_specific:
            "If this text is overlaid on an image, ensure the background is highly relevant to the new topic and use a bold, readable font like Montserrat or Impact.",
          video_specific:
            "Use a trending AI voice for TTS and sync the text appearance with the spoken words to retain attention.",
          action_call_fix:
            "Add a clear CTA at the end, such as 'Subscribe for more daily tips!' to align with the follower growth objective.",
        },
      },
    ],
    audience_voices: [
      "What is this supposed to mean? Did a cat walk on the keyboard?",
      "I waited for a punchline but it was just numbers. Next.",
      "Is this some kind of secret code or ARG?",
      "Swipe away immediately, total waste of time.",
      "Bro forgot to type the actual script.",
      "Are we supposed to call this number?",
      "Why is this on my feed?",
      "This gave me zero value, definitely not subscribing.",
      "I am so confused right now.",
      "Literally the worst Short I have ever seen.",
    ],
    final_expert_conclusion:
      "The current asset is entirely devoid of readable content, narrative structure, or platform-native elements required for YouTube Shorts. To achieve follower growth, you must completely rewrite the text to provide immediate value, whether educational or entertaining, and pair it with strong visual typography and a clear call-to-action.",
  },
};
