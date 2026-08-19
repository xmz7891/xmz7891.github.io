/**
 * macOS Desktop Theme - Posts Page Interaction
 */
(function() {
  'use strict';

  const PostsPage = {
    init: function() {
      this.initTabs();
      this.initSearch();
    },

    initTabs: function() {
      const tabs = document.querySelectorAll('.posts-tab');
      const items = document.querySelectorAll('.post-list-item');
      if (!tabs.length) return;

      tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
          tabs.forEach(function(t) { t.classList.remove('active'); });
          this.classList.add('active');

          const filter = this.getAttribute('data-tab');
          let visibleCount = 0;

          items.forEach(function(item) {
            const cat = item.getAttribute('data-category') || '';
            if (filter === 'all' || cat === filter) {
              item.classList.remove('hidden');
              visibleCount++;
            } else {
              item.classList.add('hidden');
            }
          });

          document.getElementById('postsEmpty').style.display = visibleCount === 0 ? 'block' : 'none';
        });
      });
    },

    initSearch: function() {
      const input = document.getElementById('postsSearchInput');
      const items = document.querySelectorAll('.post-list-item');
      const empty = document.getElementById('postsEmpty');
      if (!input) return;

      input.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        let visibleCount = 0;

        items.forEach(function(item) {
          const title = (item.getAttribute('data-title') || '').toLowerCase();
          if (!query || title.indexOf(query) !== -1) {
            item.classList.remove('hidden');
            visibleCount++;
          } else {
            item.classList.add('hidden');
          }
        });

        if (empty) {
          empty.style.display = visibleCount === 0 ? 'block' : 'none';
        }
      });
    }
  };

  window.PostsPage = PostsPage;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (document.querySelector('.posts-window')) {
        PostsPage.init();
      }
    });
  } else {
    if (document.querySelector('.posts-window')) {
      PostsPage.init();
    }
  }
})();
