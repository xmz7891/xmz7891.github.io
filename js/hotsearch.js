/**
 * macOS Desktop Theme - Hot Search Widget
 */
(function() {
  'use strict';

  const HotSearch = {
    // 模拟热搜数据（实际使用时可对接真实API）
    mockData: [
      { title: 'Hexo 主题开发完全指南', heat: '98万' },
      { title: 'macOS Sonoma 新特性详解', heat: '86万' },
      { title: '前端性能优化最佳实践', heat: '75万' },
      { title: 'JavaScript 异步编程进阶', heat: '68万' },
      { title: 'CSS Grid 布局完全教程', heat: '62万' },
      { title: 'Node.js 服务端开发实战', heat: '55万' },
      { title: 'Vue3 组合式 API 详解', heat: '48万' },
      { title: 'React Hooks 最佳实践', heat: '42万' },
      { title: 'TypeScript 类型体操入门', heat: '38万' },
      { title: 'Docker 容器化部署指南', heat: '35万' }
    ],

    init: function() {
      const list = document.getElementById('hotSearchList');
      if (!list) return;
      this.render(list);
    },

    render: function(container) {
      var html = '';
      this.mockData.forEach(function(item, index) {
        var rankClass = index < 3 ? 'top' + (index + 1) : '';
        html += '<div class="hot-search-item">' +
          '<span class="hot-rank ' + rankClass + '">' + (index + 1) + '</span>' +
          '<span class="hot-title">' + item.title + '</span>' +
          '<span class="hot-heat">' + item.heat + '</span>' +
        '</div>';
      });
      container.innerHTML = html;

      // 添加点击动画
      container.querySelectorAll('.hot-search-item').forEach(function(item) {
        item.addEventListener('click', function() {
          this.style.transform = 'scale(0.98)';
          var self = this;
          setTimeout(function() { self.style.transform = ''; }, 150);
        });
      });
    }
  };

  window.HotSearch = HotSearch;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (document.getElementById('hotSearchList')) {
        HotSearch.init();
      }
    });
  } else {
    if (document.getElementById('hotSearchList')) {
      HotSearch.init();
    }
  }
})();
