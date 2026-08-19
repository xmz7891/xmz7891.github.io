/**
 * macOS Desktop Theme - Window Interaction
 */

(function() {
  'use strict';

  const Window = {
    init: function() {
      this.initTrafficLights();
      this.initWindowDrag();
      this.initTocToggle();
      this.initShareBtn();
      this.initRewardBtn();
      this.initTocScrollSpy();
    },

    // 交通灯按钮
    initTrafficLights: function() {
      const windows = document.querySelectorAll('.macos-window');
      
      windows.forEach(function(win) {
        const closeBtn = win.querySelector('.traffic-light.close');
        const minimizeBtn = win.querySelector('.traffic-light.minimize');
        const maximizeBtn = win.querySelector('.traffic-light.maximize');

        if (closeBtn) {
          closeBtn.addEventListener('click', function() {
            // 关闭窗口 -> 回到首页
            window.location.href = '/';
          });
        }

        if (minimizeBtn) {
          minimizeBtn.addEventListener('click', function() {
            // 最小化窗口 -> 回到首页
            window.location.href = '/';
          });
        }

        if (maximizeBtn) {
          maximizeBtn.addEventListener('click', function() {
            win.classList.toggle('maximized');
          });
        }
      });
    },

    // 窗口拖拽
    initWindowDrag: function() {
      const windows = document.querySelectorAll('.macos-window');
      
      windows.forEach(function(win) {
        const titlebar = win.querySelector('.window-titlebar');
        if (!titlebar) return;

        let isDragging = false;
        let startX, startY, initialX, initialY;

        titlebar.addEventListener('mousedown', function(e) {
          if (e.target.closest('.traffic-lights, .window-controls-right')) return;
          
          isDragging = true;
          win.classList.add('dragging');
          startX = e.clientX;
          startY = e.clientY;
          
          const rect = win.getBoundingClientRect();
          initialX = rect.left;
          initialY = rect.top;
          
          win.style.position = 'fixed';
          win.style.margin = '0';
          e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
          if (!isDragging) return;
          
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          
          win.style.left = (initialX + dx) + 'px';
          win.style.top = Math.max(28, initialY + dy) + 'px';
          win.style.transform = 'none';
        });

        document.addEventListener('mouseup', function() {
          if (isDragging) {
            isDragging = false;
            win.classList.remove('dragging');
          }
        });
      });
    },

    // 目录切换
    initTocToggle: function() {
      const toggle = document.getElementById('tocToggle');
      const toc = document.getElementById('postToc');
      
      if (!toggle || !toc) return;

      toggle.addEventListener('click', function() {
        toc.style.display = toc.style.display === 'none' ? '' : 'none';
      });
    },

    // 分享按钮
    initShareBtn: function() {
      const btn = document.getElementById('shareBtn');
      if (!btn) return;

      btn.addEventListener('click', function() {
        if (navigator.share) {
          navigator.share({
            title: document.title,
            url: window.location.href
          });
        } else {
          navigator.clipboard.writeText(window.location.href).then(function() {
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(function() {
              btn.innerHTML = '<i class="fas fa-share-alt"></i>';
            }, 2000);
          });
        }
      });
    },

    // 打赏按钮
    initRewardBtn: function() {
      const btn = document.getElementById('rewardBtn');
      const qrcodes = document.getElementById('rewardQrcodes');
      
      if (!btn || !qrcodes) return;

      btn.addEventListener('click', function() {
        qrcodes.style.display = qrcodes.style.display === 'none' ? 'flex' : 'none';
      });
    },

    // 目录滚动监听
    initTocScrollSpy: function() {
      const content = document.querySelector('.post-content-wrapper');
      const tocLinks = document.querySelectorAll('.post-toc-sidebar a');
      
      if (!content || tocLinks.length === 0) return;

      const headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3');
      
      content.addEventListener('scroll', function() {
        let current = '';
        headings.forEach(function(heading) {
          const rect = heading.getBoundingClientRect();
          if (rect.top < 150) {
            current = heading.id;
          }
        });

        tocLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
          }
        });
      });

      // 目录点击平滑滚动
      tocLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href').substring(1);
          const target = document.getElementById(targetId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }
  };

  window.Window = Window;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      Window.init();
    });
  } else {
    Window.init();
  }
})();
