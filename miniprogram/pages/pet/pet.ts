Page({
  data: {
    currentTab: 0,
    petList: [
      {
        name: "耐反猴子", type: "T0首发", points: "3力2耐 (或加体)",
        skills: ["审判", "物免", "吸血", "保命", "报复", "穿刺", "袭击", "物防"],
        hufu: ["见招拆招", "虎背熊腰"],
        note: "兽魂带阴阳劫。如果坐骑没护盾，虎背熊腰依然是T0。"
      },
      {
        name: "敏攻猴子", type: "T0首发", points: "4力1敏",
        skills: ["迅速", "物爆", "穿刺", "袭击", "魔免/群抗", "审判", "保命", "吸血"],
        hufu: ["绝处逢生", "见招拆招"],
        note: "高配速压制，兽魂带阴阳劫。"
      },
      {
        name: "玄武(首发)", type: "物攻肉盾", points: "3力2耐",
        skills: ["物爆", "保命", "物连", "审判", "吸血", "穿刺", "物防", "袭击"],
        hufu: ["见招拆招"],
        note: "核心护符一定是见招拆招。"
      },
      {
        name: "白虎", type: "高爆克制", points: "5力 (杀宝宝用)",
        skills: ["审判", "禁鬼", "精准", "袭击", "物爆", "洞察", "穿刺", "鬼魂/重生"],
        note: "备注：杀人白虎已淘汰，现在主要用于清宠。"
      }
    ]
  },
  switchTab(e: any) {
    this.setData({ currentTab: e.currentTarget.dataset.index });
  }
})