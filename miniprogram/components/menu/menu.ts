Component({
  data: {
    showMenu: false,
    // 获取当前页面路径，用于标记选中态
    active: ''
  },
  lifetimes: {
    attached() {
      // 页面加载时，自动标记当前页面对应的菜单项为选中
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1].route;
      if (currentPage.includes('index')) {
        this.setData({ active: 'index' });
      } else if (currentPage.includes('pet')) {
        this.setData({ active: 'pet' });
      } else if (currentPage.includes('wiki')) {
        this.setData({ active: 'wiki' });
      }
    }
  },
  methods: {
    toggleMenu() {
      this.setData({
        showMenu: !this.data.showMenu
      });
    },
    goToPage(e: any) {
      const path = e.currentTarget.dataset.path;
      const name = e.currentTarget.dataset.name;
      // 跳转到对应页面
      wx.switchTab({ url: path });
      // 更新选中态
      this.setData({ 
        active: name,
        showMenu: false 
      });
    }
  }
});