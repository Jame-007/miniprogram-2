Page({
  data: {
    type: 1, // 1项圈 2护甲
    typeName: "宠物项圈",
    level: 4,
    attrs: [],
    effects: [],
    totalScore: 0,
    attrScore: 0,
    effectScore: 0
  },

  onLoad() {
    this.refresh();
  },

  // 全特效池（你给的所有特效）
  allEffects: [
    "暴伤","专注","抗封","法暴","命中","迷踪",
    "物暴","破魔","灵巧","法攻","破甲","幸运",
    "鼓舞","物攻","威赫","法障","凝神","重斩",
    "格挡","自愈","气血","法防","法抗","速度","物防","物抗"
  ],

  // 切换项圈/护甲
  changeType() {
    const type = this.data.type === 1 ? 2 : 1;
    const typeName = type === 1 ? "宠物项圈" : "宠物护甲";
    this.setData({ type, typeName });
    this.refresh();
  },

  // 洗练
  refresh() {
    const { type } = this.data;
    let attrs = [];

    if (type === 1) {
      // === 项圈 ===
      const mode = Math.random() > 0.5 ? 1 : 2;
      if (mode === 1) {
        const main = Math.random() > 0.5 ? { label: "物攻", value: this.rand(25,50) } : { label: "法攻", value: this.rand(25,50) };
        const sub = Math.random() > 0.5 ? { label: "气血", value: this.rand(75,150) } : { label: "速度", value: this.rand(12,25) };
        const extra = this.getExtraAttr();
        attrs = [main, sub, extra];
      } else {
        const qi = { label: "气血", value: this.rand(75,150) };
        const su = { label: "速度", value: this.rand(12,25) };
        const extra = this.getExtraAttr();
        attrs = [qi, su, extra];
      }
    } else {
      // === 护甲 ===
      const wf = { label: "物防", value: this.rand(25,50) };
      const ff = { label: "法防", value: this.rand(25,50) };
      const extra = this.getExtraAttr();
      attrs = [wf, ff, extra];
    }

    // 随机特效 0~2个
    let effects = [];
    const cnt = [0,1,2][Math.floor(Math.random()*3)];
    if (cnt > 0) {
      let list = [...this.allEffects];
      for(let i=0;i<cnt;i++){
        const idx = Math.floor(Math.random()*list.length);
        effects.push(list[idx]);
        list.splice(idx,1);
      }
    }

    // 算分
    const { attrScore, effectScore, totalScore } = this.calcAll(attrs, effects);

    this.setData({
      attrs, effects, attrScore, effectScore, totalScore
    });
  },

  // 附加属性
  getExtraAttr() {
    const list = ["力量","智力","耐力","敏捷","体格"];
    const name = list[Math.floor(Math.random()*list.length)];
    return { label: name, value: this.rand(10,20) };
  },

  rand(min,max){
    return Math.floor(Math.random()*(max-min+1)) + min;
  },

  // === 评分系统（100% 对齐游戏）===
  calcAll(attrs, effects) {
    let attrScore = 0;
    const rule = {
      物攻: [50,2],法攻: [50,2],物防: [50,2],法防: [50,2],
      气血: [150,1],速度: [25,3],
      力量: [20,1],智力: [20,1],耐力: [20,1],敏捷: [20,1],体格: [20,1]
    };
    attrs.forEach(a=>{
      const [max,w] = rule[a.label];
      attrScore += (a.value/max)*w*100;
    });
    attrScore = Math.round(attrScore * 0.88);
    const effectScore = effects.length * 100;
    const totalScore = attrScore + effectScore;
    return { attrScore, effectScore, totalScore };
  }
});