/**
 * macOS Desktop Theme - Main macOS Logic
 */

(function() {
  'use strict';

  const macOS = {
    init: function() {
      this.initBodyClass();
      this.initDesktopIcons();
      this.initFileItems();
      this.initBackToTop();
      this.initReadingProgress();
      this.initLazyLoad();
      this.initFancybox();
      this.initCodeCopy();
      this.initSearch();
    },

    initBodyClass: function() {
      if (document.querySelector('.desktop-posts-grid') ||
          document.querySelector('.desktop-icons-container')) {
        document.body.classList.add('is-home');
      }
    },

    // 桌面图标双击打开
    initDesktopIcons: function() {
      const icons = document.querySelectorAll('.desktop-icon');
      icons.forEach(function(icon) {
        icon.addEventListener('dblclick', function() {
          const url = this.getAttribute('data-url');
          if (url) {
            window.location.href = url;
          }
        });

        icon.addEventListener('click', function(e) {
          e.stopPropagation();
          document.querySelectorAll('.desktop-icon.selected').forEach(function(el) {
            el.classList.remove('selected');
          });
          this.classList.add('selected');
        });

        icon.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            const url = this.getAttribute('data-url');
            if (url) window.location.href = url;
          }
        });
      });

      document.querySelector('.macos-desktop')?.addEventListener('click', function() {
        document.querySelectorAll('.desktop-icon.selected, .desktop-file-item.selected').forEach(function(el) {
          el.classList.remove('selected');
        });
      });
    },

    // 桌面文件项（首页文章）
    initFileItems: function() {
      const items = document.querySelectorAll('.desktop-file-item');
      items.forEach(function(item) {
        item.addEventListener('dblclick', function() {
          const url = this.getAttribute('data-url');
          if (url) {
            window.location.href = url;
          }
        });

        item.addEventListener('click', function(e) {
          e.stopPropagation();
          document.querySelectorAll('.desktop-file-item.selected').forEach(function(el) {
            el.classList.remove('selected');
          });
          this.classList.add('selected');
        });

        item.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            const url = this.getAttribute('data-url');
            if (url) window.location.href = url;
          }
        });
      });
    },

    // 回到顶部
    initBackToTop: function() {
      const btn = document.getElementById('backToTop');
      if (!btn) return;

      const scrollContainer = document.querySelector('.post-content-wrapper') ||
                             document.querySelector('.window-content');

      if (!scrollContainer) return;

      scrollContainer.addEventListener('scroll', function() {
        if (scrollContainer.scrollTop > 300) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      });

      btn.addEventListener('click', function() {
        scrollContainer.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    },

    // 阅读进度条
    initReadingProgress: function() {
      const progress = document.getElementById('readingProgress');
      if (!progress) return;

      const content = document.querySelector('.post-content-wrapper');
      if (!content) return;

      content.addEventListener('scroll', function() {
        const scrollTop = content.scrollTop;
        const scrollHeight = content.scrollHeight - content.clientHeight;
        const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progress.style.width = percent + '%';
      });
    },

    // 图片懒加载
    initLazyLoad: function() {
      const images = document.querySelectorAll('img[loading="lazy"]');

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.complete) {
                img.classList.add('loaded');
              } else {
                img.addEventListener('load', function() {
                  img.classList.add('loaded');
                });
              }
              observer.unobserve(img);
            }
          });
        });

        images.forEach(function(img) {
          observer.observe(img);
        });
      } else {
        images.forEach(function(img) {
          img.classList.add('loaded');
        });
      }
    },

    // Fancybox 图片灯箱
    initFancybox: function() {
      if (typeof Fancybox === 'undefined') return;

      const content = document.querySelector('.post-content, .page-content');
      if (!content) return;

      const images = content.querySelectorAll('img:not(.no-lightbox)');
      images.forEach(function(img) {
        if (!img.closest('a')) {
          const link = document.createElement('a');
          link.href = img.src;
          link.setAttribute('data-fancybox', 'gallery');
          img.parentNode.insertBefore(link, img);
          link.appendChild(img);
        }
      });

      Fancybox.bind('[data-fancybox]', {
        animated: true,
        showClass: 'fancybox-fadeIn',
        hideClass: 'fancybox-fadeOut',
        Toolbar: {
          display: ['zoom', 'slideshow', 'thumbs', 'close']
        }
      });
    },

    // 代码复制按钮 - 适配 Hexo figure.highlight 结构
    initCodeCopy: function() {
      const self = this;

      // Hexo highlight 结构: figure.highlight > table > td.code > pre
      const figures = document.querySelectorAll('.markdown-body figure.highlight');
      figures.forEach(function(figure) {
        const btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.innerHTML = '<i class="fas fa-copy"></i> 复制';
        figure.style.position = 'relative';
        figure.appendChild(btn);

        btn.addEventListener('click', function() {
          const codePre = figure.querySelector('.code pre');
          if (codePre) {
            const text = codePre.innerText || codePre.textContent;
            self.copyToClipboard(text, btn);
          }
        });
      });

      // 兼容普通 pre 结构（不在 figure.highlight 内的）
      const pres = document.querySelectorAll('.markdown-body pre');
      pres.forEach(function(pre) {
        if (pre.closest('figure.highlight')) return;
        if (pre.querySelector('.code-copy-btn')) return;

        const btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.innerHTML = '<i class="fas fa-copy"></i> 复制';
        pre.appendChild(btn);

        btn.addEventListener('click', function() {
          const code = pre.querySelector('code') || pre;
          const text = code.innerText || code.textContent;
          self.copyToClipboard(text, btn);
        });
      });
    },

    copyToClipboard: function(text, btn) {
      navigator.clipboard.writeText(text).then(function() {
        btn.innerHTML = '<i class="fas fa-check"></i> 已复制';
        setTimeout(function() {
          btn.innerHTML = '<i class="fas fa-copy"></i> 复制';
        }, 2000);
      }).catch(function() {
        btn.innerHTML = '<i class="fas fa-times"></i> 失败';
      });
    },

    // 搜索功能
    initSearch: function() {
      const trigger = document.getElementById('searchTrigger');
      const overlay = document.getElementById('searchOverlay');
      const close = document.getElementById('searchClose');
      const input = document.getElementById('searchInput');
      const results = document.getElementById('searchResults');

      if (!trigger || !overlay) return;

      trigger.addEventListener('click', function() {
        overlay.classList.add('active');
        setTimeout(function() { input.focus(); }, 100);
      });

      close.addEventListener('click', function() {
        overlay.classList.remove('active');
        input.value = '';
        results.innerHTML = '<div class="search-hint"><i class="fas fa-keyboard"></i><span>输入关键词搜索，按 ESC 关闭</span></div>';
      });

      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
          close.click();
        }
      });

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          close.click();
        }
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          trigger.click();
        }
      });

      input.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        if (!query) {
          results.innerHTML = '<div class="search-hint"><i class="fas fa-keyboard"></i><span>输入关键词搜索，按 ESC 关闭</span></div>';
          return;
        }

        const posts = window.__posts__ || [];
        const matched = posts.filter(function(post) {
          return post.title.toLowerCase().indexOf(query) !== -1 ||
                 (post.content && post.content.toLowerCase().indexOf(query) !== -1);
        });

        if (matched.length === 0) {
          results.innerHTML = '<div class="search-hint"><i class="fas fa-search"></i><span>未找到相关文章</span></div>';
          return;
        }

        results.innerHTML = matched.map(function(post) {
          return '<div class="search-result-item" data-url="' + post.url + '">' +
            '<div class="search-result-title">' + post.title + '</div>' +
            '<div class="search-result-meta">' + (post.date || '') + '</div>' +
          '</div>';
        }).join('');

        results.querySelectorAll('.search-result-item').forEach(function(item) {
          item.addEventListener('click', function() {
            window.location.href = this.getAttribute('data-url');
          });
        });
      });
    }
  };

  window.macOS = macOS;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      macOS.init();
    });
  } else {
    macOS.init();
  }
})();
