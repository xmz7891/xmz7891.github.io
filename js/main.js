/**
 * macOS Desktop Theme - Main Utilities
 */

(function() {
  'use strict';

  const Main = {
    init: function() {
      this.initExternalLinks();
      this.initTableWrapper();
      this.initFootnote();
      this.initPostsPage();
      this.initWelcomeClock();
    },

    // 外链新窗口打开
    initExternalLinks: function() {
      const links = document.querySelectorAll('.post-content a, .page-content a');
      links.forEach(function(link) {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
          const host = window.location.hostname;
          try {
            const url = new URL(href);
            if (url.hostname !== host) {
              link.setAttribute('target', '_blank');
              link.setAttribute('rel', 'noopener noreferrer');
            }
          } catch (e) {}
        }
      });
    },

    // 表格包裹
    initTableWrapper: function() {
      const tables = document.querySelectorAll('.post-content table, .page-content table');
      tables.forEach(function(table) {
        if (!table.parentElement.classList.contains('table-wrapper')) {
          const wrapper = document.createElement('div');
          wrapper.className = 'table-wrapper';
          wrapper.style.overflowX = 'auto';
          table.parentNode.insertBefore(wrapper, table);
          wrapper.appendChild(table);
        }
      });
    },

    // 脚注处理
    initFootnote: function() {
      const footnotes = document.querySelectorAll('.post-content .footnote');
    },

    // 文章页面 - 搜索和分栏
    initPostsPage: function() {
      var searchInput = document.getElementById('postsSearchInput');
      var searchClear = document.getElementById('postsSearchClear');
      var tabs = document.querySelectorAll('.posts-tab');
      var subtabsEl = document.getElementById('postsSubtabs');
      var items = document.querySelectorAll('.post-list-item');
      var empty = document.getElementById('postsEmpty');
      var resultInfo = document.getElementById('postsResultInfo');
      var sortBtns = document.querySelectorAll('.sort-btn');
      var resetBtn = document.getElementById('postsResetBtn');
      var listEl = document.getElementById('postsList');

      if (!searchInput && tabs.length === 0) return;

      var currentTab = 'all';
      var currentSubtab = '';
      var currentSearch = '';
      var currentSort = 'date-desc';

      function getSubtabs(type) {
        var values = {};
        items.forEach(function(item) {
          var val;
          if (type === 'categories') {
            val = (item.getAttribute('data-category') || '').split(',');
          } else if (type === 'tags') {
            val = (item.getAttribute('data-tags') || '').split(',');
          } else if (type === 'archive') {
            val = [item.getAttribute('data-year') || ''];
          }
          if (Array.isArray(val)) {
            val.forEach(function(v) { if (v) values[v] = true; });
          }
        });
        return Object.keys(values).sort();
      }

      function renderSubtabs(type) {
        if (!subtabsEl) return;
        var list = getSubtabs(type);
        if (list.length === 0) {
          subtabsEl.style.display = 'none';
          return;
        }
        subtabsEl.innerHTML = '';
        subtabsEl.style.display = 'flex';
        list.forEach(function(name) {
          var btn = document.createElement('span');
          btn.className = 'posts-subtab' + (currentSubtab === name ? ' active' : '');
          btn.textContent = name;
          btn.addEventListener('click', function() {
            subtabsEl.querySelectorAll('.posts-subtab').forEach(function(s) { s.classList.remove('active'); });
            this.classList.add('active');
            currentSubtab = name;
            filterItems();
          });
          subtabsEl.appendChild(btn);
        });
      }

      function filterItems() {
        var visibleCount = 0;
        items.forEach(function(item) {
          var title = (item.getAttribute('data-title') || '').toLowerCase();
          var tags = (item.getAttribute('data-tags') || '').toLowerCase();
          var category = item.getAttribute('data-category') || '';
          var year = item.getAttribute('data-year') || '';

          var matchTab = true;
          if (currentTab === '__categories__') {
            matchTab = !currentSubtab || category.indexOf(currentSubtab) !== -1;
          } else if (currentTab === '__tags__') {
            matchTab = !currentSubtab || tags.indexOf(currentSubtab.toLowerCase()) !== -1;
          } else if (currentTab === '__archive__') {
            matchTab = !currentSubtab || year === currentSubtab;
          }

          var matchSearch = !currentSearch ||
            title.indexOf(currentSearch) !== -1 ||
            tags.indexOf(currentSearch) !== -1;

          if (matchTab && matchSearch) {
            item.classList.remove('hide');
            visibleCount++;
          } else {
            item.classList.add('hide');
          }
        });

        if (empty) empty.style.display = visibleCount === 0 ? 'block' : 'none';
        if (resultInfo) resultInfo.textContent = '共 ' + visibleCount + ' 篇文章';
      }

      function sortItems() {
        var arr = Array.from(items);
        arr.sort(function(a, b) {
          if (currentSort === 'date-desc') {
            return (b.getAttribute('data-date') || '').localeCompare(a.getAttribute('data-date') || '');
          } else if (currentSort === 'date-asc') {
            return (a.getAttribute('data-date') || '').localeCompare(b.getAttribute('data-date') || '');
          } else if (currentSort === 'title') {
            return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-CN');
          }
          return 0;
        });
        arr.forEach(function(item, idx) {
          item.style.animationDelay = (idx * 0.02) + 's';
          listEl.appendChild(item);
        });
      }

      // 分栏切换
      tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
          tabs.forEach(function(t) { t.classList.remove('active'); });
          this.classList.add('active');
          var tabVal = this.getAttribute('data-tab');
          var tabType = this.getAttribute('data-type');
          currentTab = tabVal;
          currentSubtab = '';

          if (tabType === 'group') {
            var groupType = tabVal.replace(/^__/, '').replace(/__$/, '');
            renderSubtabs(groupType);
          } else {
            if (subtabsEl) subtabsEl.style.display = 'none';
          }
          filterItems();
        });
      });

      // 排序
      sortBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          sortBtns.forEach(function(b) { b.classList.remove('active'); });
          this.classList.add('active');
          currentSort = this.getAttribute('data-sort');
          sortItems();
        });
      });

      // 搜索
      if (searchInput) {
        searchInput.addEventListener('input', function() {
          currentSearch = this.value.trim().toLowerCase();
          if (searchClear) searchClear.style.display = currentSearch ? 'block' : 'none';
          filterItems();
        });
      }
      if (searchClear) {
        searchClear.addEventListener('click', function() {
          searchInput.value = '';
          currentSearch = '';
          this.style.display = 'none';
          filterItems();
          searchInput.focus();
        });
      }

      // 重置
      if (resetBtn) {
        resetBtn.addEventListener('click', function() {
          tabs.forEach(function(t) { t.classList.remove('active'); });
          if (tabs[0]) tabs[0].classList.add('active');
          currentTab = 'all';
          currentSubtab = '';
          currentSearch = '';
          if (searchInput) searchInput.value = '';
          if (searchClear) searchClear.style.display = 'none';
          if (subtabsEl) subtabsEl.style.display = 'none';
          filterItems();
        });
      }

      sortItems();
      filterItems();
    },

    // 首页欢迎时钟
    initWelcomeClock: function() {
      const timeEl = document.getElementById('welcomeTime');
      const dateEl = document.getElementById('welcomeDate');
      const greetingEl = document.getElementById('welcomeGreeting');

      if (!timeEl) return;

      function update() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        timeEl.textContent = h + ':' + m;

        const month = now.getMonth() + 1;
        const day = now.getDate();
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        dateEl.textContent = month + '月' + day + '日 ' + weekdays[now.getDay()];

        const hour = now.getHours();
        let greeting = '欢迎回来~';
        if (hour >= 5 && hour < 11) greeting = '早上好，新的一天开始啦！☀️';
        else if (hour >= 11 && hour < 13) greeting = '中午好，记得吃饭哦~🍜';
        else if (hour >= 13 && hour < 18) greeting = '下午好，喝杯茶吧~🍵';
        else if (hour >= 18 && hour < 22) greeting = '晚上好，今天辛苦啦~🌙';
        else greeting = '夜深了，早点休息哦~💤';

        if (greetingEl) greetingEl.textContent = greeting;
      }

      update();
      setInterval(update, 1000);
    }
  };

  window.Main = Main;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      Main.init();
    });
  } else {
    Main.init();
  }
})();
