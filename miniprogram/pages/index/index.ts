Page({
  goPage(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({ url });
  }
})