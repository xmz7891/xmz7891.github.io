/**
 * macOS Desktop Theme - Dock Interaction
 * 每个图标独立 scale 插值，实现丝滑的波浪放大效果
 */
(function() {
  'use strict';
  const Dock = {
    config: {
      baseWidth: 52,
      maxScale: 1.7,
      radius: 120,
      scaleEasing: 0.18,
      widthEasing: 0.25
    },
    items: [],
    itemStates: [],
    rafId: null,
    mouseX: null,
    dockRect: null,
    animating: false,
    init: function(config) {
      if (config) Object.assign(this.config, config);
      this.initItems();
      this.initMagnification();
    },
    initItems: function() {
      const items = document.querySelectorAll('.dock-item[data-link]');
      items.forEach(function(item) {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          const link = this.getAttribute('data-link');
          const external = this.getAttribute('data-external');
          this.classList.add('bounce');
          var self = this;
          setTimeout(function() { self.classList.remove('bounce'); }, 500);
          setTimeout(function() {
            if (external === 'true') {
              window.open(link, '_blank', 'noopener');
            } else if (link) {
              window.location.href = link;
            }
          }, 150);
        });
      });
    },
    initMagnification: function() {
      const dock = document.getElementById('dock');
      if (!dock) return;
      this.items = Array.from(dock.querySelectorAll('.dock-item'));
      const self = this;
      this.itemStates = this.items.map(function() {
        return { currentScale: 1, targetScale: 1, currentWidth: self.config.baseWidth, targetWidth: self.config.baseWidth };
      });
      this.updateDockRect();
      window.addEventListener('resize', function() { self.updateDockRect(); });
      dock.addEventListener('mousemove', function(e) {
        self.mouseX = e.clientX;
        self.startAnimation();
      });
      dock.addEventListener('mouseleave', function() {
        self.mouseX = null;
        self.startAnimation();
      });
      dock.addEventListener('touchmove', function(e) {
        if (e.touches.length > 0) {
          self.mouseX = e.touches[0].clientX;
          self.startAnimation();
        }
      }, { passive: true });
      dock.addEventListener('touchend', function() {
        self.mouseX = null;
        self.startAnimation();
      });
    },
    updateDockRect: function() {
      const dock = document.getElementById('dock');
      if (dock) this.dockRect = dock.getBoundingClientRect();
    },
    startAnimation: function() {
      if (!this.animating) {
        this.animating = true;
        this.animate();
      }
    },
    animate: function() {
      const self = this;
      const cfg = this.config;
      let allResting = true;
      this.items.forEach(function(item, index) {
        const state = self.itemStates[index];
        const icon = item.querySelector('.dock-icon');
        if (self.mouseX !== null && self.dockRect) {
          const relativeX = self.mouseX - self.dockRect.left;
          const itemRect = item.getBoundingClientRect();
          const itemCenter = itemRect.left - self.dockRect.left + itemRect.width / 2;
          const distance = Math.abs(relativeX - itemCenter);
          if (distance < cfg.radius) {
            const t = distance / cfg.radius;
            state.targetScale = 1 + (cfg.maxScale - 1) * Math.pow(Math.cos(t * Math.PI / 2), 1.5);
          } else {
            state.targetScale = 1;
          }
        } else {
          state.targetScale = 1;
        }
        state.targetWidth = cfg.baseWidth * state.targetScale;
        const scaleDiff = state.targetScale - state.currentScale;
        const widthDiff = state.targetWidth - state.currentWidth;
        if (Math.abs(scaleDiff) > 0.001 || Math.abs(widthDiff) > 0.1) {
          state.currentScale += scaleDiff * cfg.scaleEasing;
          state.currentWidth += widthDiff * cfg.widthEasing;
          allResting = false;
        } else {
          state.currentScale = state.targetScale;
          state.currentWidth = state.targetWidth;
        }
        if (icon) {
          const translateY = (state.currentScale - 1) * 28;
          icon.style.transform = 'translateY(-' + translateY + 'px) scale(' + state.currentScale + ')';
        }
        item.style.flex = '0 0 ' + state.currentWidth + 'px';
        item.style.width = state.currentWidth + 'px';
      });
      if (allResting && this.mouseX === null) {
        this.items.forEach(function(item) {
          const icon = item.querySelector('.dock-icon');
          if (icon) icon.style.transform = '';
          item.style.flex = '';
          item.style.width = '';
        });
        this.animating = false;
        this.rafId = null;
        return;
      }
      this.rafId = requestAnimationFrame(function() { self.animate(); });
    }
  };
  window.Dock = Dock;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { Dock.init(); });
  } else {
    Dock.init();
  }
})();
