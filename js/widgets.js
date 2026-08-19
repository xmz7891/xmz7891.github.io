/**
 * macOS Desktop Theme - Widgets Interaction
 * 微博热搜API异步加载（多源自动切换）、作者卡片动画等
 */

(function() {
  'use strict';

  const Widgets = {
    config: {
      // 多个备选API，按顺序尝试
      apiList: [
        'https://60s.viki.moe/v2/weibo',
        'https://api.vvhan.com/api/hotlist/wbHot',
        'https://tenapi.cn/v2/weibohot'
      ],
      limit: 8,
      cacheTime: 900000, // 15分钟缓存
      source: 'weibo'
    },

    init: function(config) {
      if (config) Object.assign(this.config, config);
      this.initHotSearch();
      this.initAvatarHover();
    },

    // 实时热搜 - 从API异步加载（多源自动切换）
    initHotSearch: function() {
      const list = document.getElementById('hotSearchList');
      const loading = document.getElementById('hotSearchLoading');
      if (!list) return;

      // 先尝试从缓存读取
      const cached = this.getCache();
      if (cached) {
        this.renderHotSearch(list, cached);
        if (loading) loading.style.display = 'none';
        return;
      }

      // 从API加载（多源尝试）
      this.fetchWithFallback().then(function(data) {
        if (data && data.length > 0) {
          Widgets.renderHotSearch(list, data);
          Widgets.setCache(data);
        } else {
          Widgets.showError(list, '暂无热搜数据');
        }
      }).catch(function() {
        Widgets.showError(list, '热搜加载失败');
      }).finally(function() {
        if (loading) loading.style.display = 'none';
      });
    },

    // 多源API自动切换
    fetchWithFallback: function() {
      const self = this;
      const apis = this.config.apiList;
      let index = 0;

      function tryNext() {
        if (index >= apis.length) {
          return Promise.reject(new Error('All APIs failed'));
        }
        const url = apis[index++];
        return fetch(url, { signal: AbortSignal.timeout(8000) })
          .then(function(res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
          })
          .then(function(result) {
            return self.parseResult(result);
          })
          .catch(function() {
            return tryNext();
          });
      }
      return tryNext();
    },

    // 解析不同API的返回格式
    parseResult: function(result) {
      let data = [];

      // 格式1: 60s.viki.moe - { code:200, data:[{title, hot_value, link}] }
      if (result.code === 200 && Array.isArray(result.data)) {
        data = result.data;
      }
      // 格式2: vvhan - { success:true, data:[{title, hot}] }
      else if (result.success && Array.isArray(result.data)) {
        data = result.data;
      }
      // 格式3: tenapi - { code:200, data:[{name, hot}] }
      else if (result.code === 200 && Array.isArray(result.data)) {
        data = result.data;
      }
      // 格式4: 直接是数组
      else if (Array.isArray(result)) {
        data = result;
      }

      if (!data || data.length === 0) return [];

      return data.slice(0, this.config.limit).map(function(item, index) {
        return {
          title: item.title || item.name || item.word || '',
          hot: item.hot_value || item.hot || item.hot_value || '',
          index: index + 1
        };
      }).filter(function(item) { return item.title; });
    },

    renderHotSearch: function(list, data) {
      list.innerHTML = '';
      data.forEach(function(item, index) {
        const li = document.createElement('li');
        li.className = 'hot-search-item';
        li.style.animationDelay = (index * 0.06) + 's';
        li.innerHTML =
          '<span class="hot-search-rank">' + item.index + '</span>' +
          '<span class="hot-search-text">' + this.escapeHtml(item.title) + '</span>' +
          (index < 3 ? '<span class="hot-search-tag">热</span>' : '');
        list.appendChild(li);
      }, this);
    },

    showError: function(list, msg) {
      list.innerHTML = '<li class="hot-search-empty" style="text-align:center;color:#999;padding:12px;font-size:12px;">' + msg + '</li>';
    },

    getCache: function() {
      try {
        const raw = localStorage.getItem('macos_hot_search');
        if (!raw) return null;
        const cached = JSON.parse(raw);
        if (Date.now() - cached.time < this.config.cacheTime) {
          return cached.data;
        }
        return null;
      } catch (e) {
        return null;
      }
    },

    setCache: function(data) {
      try {
        localStorage.setItem('macos_hot_search', JSON.stringify({
          time: Date.now(),
          data: data
        }));
      } catch (e) {}
    },

    escapeHtml: function(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    // 作者头像悬停效果
    initAvatarHover: function() {
      const avatar = document.querySelector('.profile-avatar');
      if (!avatar) return;
      avatar.style.transition = 'transform 0.3s ease';
      avatar.addEventListener('mouseenter', function() {
        this.style.transform = 'rotate(5deg) scale(1.05)';
      });
      avatar.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    }
  };

  window.Widgets = Widgets;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      Widgets.init();
    });
  } else {
    Widgets.init();
  }
})();
