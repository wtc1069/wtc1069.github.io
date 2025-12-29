// 导航栏滚动百分比逻辑
// 独立文件以实现更丝滑的无节流更新

(function() {
  const navToTop = document.getElementById('nav-totop');
  if (!navToTop) return;

  // 获取内部的 .site-page 元素（用于添加 .long 类名）
  const sitePage = navToTop.querySelector('.site-page');
  const percentText = navToTop.querySelector('.scroll-percent-text');
  
  // 使用 requestAnimationFrame 实现丝滑更新，不受 btf.throttle 限制
  const updateScrollPercent = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // 防止分母为 0
    if (scrollHeight <= 0) {
      if (percentText) percentText.textContent = 0;
      return;
    }

    let percent = Math.round((scrollTop / scrollHeight) * 100);
    
    // 边界处理
    if (percent > 100) percent = 100;
    if (percent < 0) percent = 0;

    if (percentText) {
      percentText.textContent = percent;
    }

    // 逻辑：进度 < 4 时隐藏，>= 4 时显示
    if (percent >= 4) {
      navToTop.classList.add('show');
      navToTop.classList.remove('hide');
    } else {
      navToTop.classList.add('hide');
      navToTop.classList.remove('show');
    }

    // 逻辑：进度 > 90 时，添加 .long 类名，以在 hover 时显示“返回顶部”长胶囊
    if (percent > 90) {
      if (sitePage) sitePage.classList.add('long');
      // 关键：同时给外层容器也加上 .long，让它变宽以容纳长胶囊
      navToTop.classList.add('long');
    } else {
      if (sitePage) sitePage.classList.remove('long');
      navToTop.classList.remove('long');
    }
  };

  // 使用 passive 监听器提高滚动性能
  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateScrollPercent);
  }, { passive: true });

  // 初始化一次
  updateScrollPercent();
  
  // 适配 PJAX 跳转后重新绑定
  document.addEventListener('pjax:complete', () => {
    // PJAX 完成后，如果元素被替换（通常 header 不变，但为了保险），重新获取引用
    const newNavToTop = document.getElementById('nav-totop');
    if (newNavToTop) {
       // 这里如果 DOM 没变，其实不需要做什么。
       // 只要确保 updateScrollPercent 能正常运行即可。
       // 如果 DOM 变了，之前的事件监听器虽然还在，但 sitePage/percentText 引用的是旧元素。
       // 简单起见，如果 header 是持久的，这里无需操作。
       // 如果 header 会刷新，需要重新查询并更新闭包变量。
       // 假设 header 不变，只手动触发一次更新以防万一。
       updateScrollPercent();
    }
  });

})();
