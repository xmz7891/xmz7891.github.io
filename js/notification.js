/**
 * macOS Desktop Theme - Notification Center
 * 右上角 macOS 风格通知，按时段问候，3秒自动收回
 */

(function() {
  'use strict';

  const Notification = {
    config: {
      duration: 3000,
      greeting: {
        morning: '早上好哇~ 今天也要元气满满哦！☀️',
        noon: '中午好呀~ 记得吃午饭哦！🍜',
        afternoon: '下午好~ 喝杯茶休息一下吧🍵',
        evening: '晚上好呀~ 今天辛苦啦！🌙',
        night: '夜深了~ 早点休息哦！💤'
      },
      timeRanges: {
        morning: [5, 11],
        noon: [11, 13],
        afternoon: [13, 18],
        evening: [18, 22],
        night: [22, 5]
      }
    },

    init: function(config) {
      if (config) {
        if (config.greeting) Object.assign(this.config.greeting, config.greeting);
        if (config.timeRanges) Object.assign(this.config.timeRanges, config.timeRanges);
        if (config.duration) this.config.duration = config.duration;
      }
      this.showGreeting();
      this.initClose();
    },

    getGreeting: function() {
      const hour = new Date().getHours();
      const ranges = this.config.timeRanges;
      const g = this.config.greeting;

      if (hour >= ranges.morning[0] && hour < ranges.morning[1]) return g.morning;
      if (hour >= ranges.noon[0] && hour < ranges.noon[1]) return g.noon;
      if (hour >= ranges.afternoon[0] && hour < ranges.afternoon[1]) return g.afternoon;
      if (hour >= ranges.evening[0] && hour < ranges.evening[1]) return g.evening;
      // 夜间 (22点到5点)
      if (hour >= ranges.night[0] || hour < ranges.night[1]) return g.night;
      return g.evening;
    },

    showGreeting: function() {
      const item = document.getElementById('greetingNotification');
      const messageEl = document.getElementById('notificationMessage');
      const timeEl = document.getElementById('notificationTime');
      if (!item || !messageEl) return;

      messageEl.textContent = this.getGreeting();
      if (timeEl) {
        const now = new Date();
        timeEl.textContent = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
      }

      var self = this;
      setTimeout(function() {
        item.classList.add('show');
      }, 600);

      setTimeout(function() {
        self.hide(item);
      }, 600 + this.config.duration);
    },

    show: function(title, message, duration) {
      const item = document.getElementById('greetingNotification');
      if (!item) return;
      const titleEl = document.getElementById('notificationTitle');
      const messageEl = document.getElementById('notificationMessage');
      if (titleEl) titleEl.textContent = title || '通知';
      if (messageEl) messageEl.textContent = message || '';
      item.classList.remove('hide');
      item.classList.add('show');
      var self = this;
      setTimeout(function() { self.hide(item); }, duration || this.config.duration);
    },

    hide: function(item) {
      item.classList.remove('show');
      item.classList.add('hide');
    },

    initClose: function() {
      const closeBtn = document.getElementById('notificationClose');
      const item = document.getElementById('greetingNotification');
      if (closeBtn && item) {
        closeBtn.addEventListener('click', function() {
          item.classList.remove('show');
          item.classList.add('hide');
        });
      }
    }
  };

  window.Notification = Notification;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (document.getElementById('notificationCenter')) {
        Notification.init();
      }
    });
  } else {
    if (document.getElementById('notificationCenter')) {
      Notification.init();
    }
  }
})();
