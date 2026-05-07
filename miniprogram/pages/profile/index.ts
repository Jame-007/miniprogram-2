Page({
  data: {
    hasLogin: false,
    userInfo: {},
    signedDates: [],
    signedToday: false,
    pointCount: 0,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    daysList: [],
    selectDate: '',
    money: '',
    typeList: ['收入','支出'],
    typeIdx: 0,
    recordList: [],
    allRecord: {},
    totalBalance: 0
  },

  onLoad() {
    this.loadLocalData();
    this.initCalendar();
  },

  // 加载本地数据
  loadLocalData() {
    const signedDates = wx.getStorageSync('signedDates') || [];
    const pointCount = wx.getStorageSync('pointCount') || 0;
    const allRecord = wx.getStorageSync('allRecord') || {};
    const hasLogin = wx.getStorageSync('hasLogin') || false;
    const userInfo = wx.getStorageSync('userInfo') || {};

    const todayStr = this.getTodayStr();
    const signedToday = signedDates.includes(todayStr);

    this.setData({
      signedDates,
      pointCount,
      allRecord,
      hasLogin,
      userInfo,
      signedToday
    });
    this.calcTotalBalance();
  },

  // 保存本地数据
  saveLocalData() {
    wx.setStorageSync('signedDates', this.data.signedDates);
    wx.setStorageSync('pointCount', this.data.pointCount);
    wx.setStorageSync('allRecord', this.data.allRecord);
    wx.setStorageSync('hasLogin', this.data.hasLogin);
    wx.setStorageSync('userInfo', this.data.userInfo);
  },

  // 获取今天日期字符串
  getTodayStr() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  },

  // 登录
  login() {
    wx.getUserProfile({
      desc: '用于完善用户信息',
      success: (res) => {
        this.setData({
          hasLogin: true,
          userInfo: res.userInfo
        });
        this.saveLocalData();
        wx.showToast({ title: '登录成功' });
      }
    });
  },

  // 签到
  doSign() {
    if (!this.data.hasLogin) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    if (this.data.signedToday) {
      wx.showToast({ title: '今日已签到', icon: 'none' });
      return;
    }

    const todayStr = this.getTodayStr();
    const signedDates = [...this.data.signedDates, todayStr];
    const newPoint = this.data.pointCount + 10;

    this.setData({
      signedDates,
      signedToday: true,
      pointCount: newPoint
    });
    this.saveLocalData();
    this.initCalendar();
    wx.showToast({ title: '签到成功，获得10点卡粒' });
  },

  // 初始化日历
  initCalendar() {
    const { year, month, signedDates, allRecord } = this.data;
    const days = new Date(year, month, 0).getDate();
    const today = new Date();
    const todayStr = this.getTodayStr();

    let daysList = [];
    for (let i = 1; i <= days; i++) {
      const dayStr = `${year}-${month}-${i}`;
      const isToday = (year === today.getFullYear() && month === today.getMonth() + 1 && i === today.getDate());
      const isSigned = signedDates.includes(dayStr);
      const hasRecord = !!allRecord[dayStr];
      daysList.push({
        day: i,
        isToday,
        isSigned,
        hasRecord
      });
    }

    this.setData({
      daysList,
      selectDate: `${year}年${month}月${this.data.day}日`
    });
    this.getDayRecord(this.data.day);
  },

  // 切换月份
  prevMonth() {
    let { year, month } = this.data;
    month--;
    if (month < 1) {
      month = 12;
      year--;
    }
    this.setData({ year, month, day: 1 });
    this.initCalendar();
  },

  nextMonth() {
    let { year, month } = this.data;
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
    this.setData({ year, month, day: 1 });
    this.initCalendar();
  },

  // 选择日期
  selectDay(e) {
    const day = e.currentTarget.dataset.day;
    this.setData({ day, selectDate: `${this.data.year}年${this.data.month}月${day}日` });
    this.getDayRecord(day);
  },

  // 获取当日记录
  getDayRecord(day) {
    const { year, month, allRecord } = this.data;
    const key = `${year}-${month}-${day}`;
    this.setData({ recordList: allRecord[key] || [] });
  },

  // 输入元宝
  inputMoney(e) {
    this.setData({ money: e.detail.value });
  },

  // 切换收支类型
  changeType(e) {
    this.setData({ typeIdx: e.detail.value });
  },

  // 添加记录
  addRecord() {
    if (!this.data.hasLogin) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    const { money, typeIdx, year, month, day } = this.data;
    if (!money) {
      wx.showToast({ title: '请输入元宝数量', icon: 'none' });
      return;
    }

    const key = `${year}-${month}-${day}`;
    const allRecord = { ...this.data.allRecord };
    if (!allRecord[key]) allRecord[key] = [];
    allRecord[key].push({
      money: parseInt(money),
      type: this.data.typeList[typeIdx]
    });

    this.setData({
      allRecord,
      money: ''
    });
    this.saveLocalData();
    this.getDayRecord(day);
    this.calcTotalBalance();
    this.initCalendar();
    wx.showToast({ title: '记录添加成功' });
  },

  // 计算总余额
  calcTotalBalance() {
    let total = 0;
    const records = this.data.allRecord;
    for (let dateKey in records) {
      records[dateKey].forEach(item => {
        total += item.type === '收入' ? item.money : -item.money;
      });
    }
    this.setData({ totalBalance: total });
  }
});