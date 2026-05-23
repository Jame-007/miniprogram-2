Page({
  data: {
    wuliSpeed: 1200,
    zhenfa: true,
    jifeng: true,
    jiansu: false,
    showResult: false,
    needMe: 0,
    needPet: 0,
    detail: '',
  },

  onWuliInput(e: WechatMiniprogram.Input) {
    this.setData({ wuliSpeed: parseInt(e.detail.value, 10) || 0 });
  },

  toggleZhenfa() { this.setData({ zhenfa: !this.data.zhenfa }); },
  toggleJifeng() { this.setData({ jifeng: !this.data.jifeng }); },
  toggleJiansu() { this.setData({ jiansu: !this.data.jiansu }); },

  calcMax(s: number): number {
    let diff = s * 0.03;
    if (diff > 50) diff = 50;
    return s + diff;
  },

  calcMin(s: number): number {
    let diff = s * 0.03;
    if (diff > 50) diff = 50;
    return s - diff;
  },

  calculate() {
    const wuli = this.data.wuliSpeed;
    if (!wuli || wuli <= 0) {
      wx.showToast({ title: '请输入物理速度', icon: 'none' });
      return;
    }

    const zhenfa = this.data.zhenfa ? 1.10 : 1;
    const jifeng = this.data.jifeng ? 1.12 : 1;
    const jiansu = this.data.jiansu ? 0.85 : 1;

    // ── 第1步：人物面板需多少稳超物理 ──
    const wuliFinal = wuli * zhenfa;
    const wuliTop = this.calcMax(wuliFinal);

    let needMe = 1;
    while (true) {
      const myFinal = needMe * zhenfa * jifeng * jiansu;
      const myLow = this.calcMin(myFinal);
      if (myLow >= wuliTop) break;
      needMe++;
    }

    // ── 第2步：宠物需多少稳超人物 ──
    const myFinalReal = needMe * zhenfa * jifeng * jiansu;
    const myTop = this.calcMax(myFinalReal);

    let needPet = 1;
    while (true) {
      const petLow = this.calcMin(needPet);
      if (petLow >= myTop) break;
      needPet++;
    }

    // ── 明细 ──
    const txt = [
      '📊 纯小数精确计算（无四舍五入）',
      '• 乱敏：±3%，上限±50',
      '• 阵法/疾风/缚妖索：仅人物生效',
      '• 宠物：无任何加成',
      '',
      '🧑 人物稳超物理：面板≥ ' + needMe,
      '🐶 宠物稳超人物：面板≥ ' + needPet,
    ].join('\n');

    this.setData({
      showResult: true,
      needMe,
      needPet,
      detail: txt,
    });
  },

  clearAll() {
    this.setData({
      showResult: false,
      wuliSpeed: 1200,
      zhenfa: true,
      jifeng: true,
      jiansu: false,
      needMe: 0,
      needPet: 0,
      detail: '',
    });
  },
});
