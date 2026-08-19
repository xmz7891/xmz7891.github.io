/**
 * macOS Desktop Theme - Status Bar
 */

(function() {
  'use strict';

  const StatusBar = {
    init: function() {
      this.updateTime();
      setInterval(this.updateTime.bind(this), 1000);
    },

    updateTime: function() {
      const now = new Date();
      
      // 时间
      const timeEl = document.getElementById('statusbarClock');
      if (timeEl) {
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeEl.textContent = hours + ':' + minutes;
      }

      // 日期
      const monthDayEl = document.getElementById('statusbarMonthDay');
      if (monthDayEl) {
        const month = now.getMonth() + 1;
        const day = now.getDate();
        monthDayEl.textContent = month + '月' + day + '日';
      }

      // 星期
      const weekdayEl = document.getElementById('statusbarWeekday');
      if (weekdayEl) {
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        weekdayEl.textContent = weekdays[now.getDay()];
      }
    }
  };

  window.StatusBar = StatusBar;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      StatusBar.init();
    });
  } else {
    StatusBar.init();
  }
})();
