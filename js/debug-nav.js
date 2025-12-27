/* source/js/debug-nav.js */
(function() {
  console.log("%c 🕵️‍♂️ 侦探脚本已加载，正在寻找导航栏...", "background: #333; color: #fff;");

  var checkInterval = setInterval(function() {
    var target = document.getElementById('page-header') || document.getElementById('nav');
    
    if (target) {
      clearInterval(checkInterval);
      console.log("%c ✅ 找到导航栏，开始监控！", "background: green; color: #fff;");

      // 记录初始状态
      console.log("初始类名:", target.className);
      console.log("初始样式:", target.getAttribute('style'));

      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          // 获取当前时间戳（毫秒）
          var time = performance.now().toFixed(0) + 'ms';
          
          if (mutation.attributeName === 'class') {
            var cls = target.className;
            var msg = `[${time}] 类名变了 ➔ "${cls}"`;
            
            // 重点标记我们关心的类
            if (cls.includes('nav-visible')) {
              console.warn(msg + " (⚠️ 侦测到 nav-visible: 主题想显示菜单)");
            } else if (cls.includes('show-menu-mode')) {
              console.log(msg + " (✅ 侦测到 show-menu-mode: 你的脚本在工作)");
            } else {
              console.log(msg);
            }
          } 
          
          if (mutation.attributeName === 'style') {
            console.log(`[${time}] 🎨 行内样式变了 ➔ ${target.getAttribute('style')}`);
          }
        });
      });

      // 启动监控：观察 class 和 style
      observer.observe(target, { attributes: true, attributeFilter: ['class', 'style'] });
    }
  }, 50); // 每50ms检查一次元素是否存在
})();

(function() {
  // 记录脚本启动的绝对时间
  var startTime = performance.now();
  var header = document.getElementById('page-header');

  console.group("%c 🛑 外部 JS 监控启动 ", "background: #e74c3c; color: #fff; font-size: 14px; padding: 4px;");

  if (!header) {
    console.error("❌ 错误：外部脚本执行时，还没找到 #page-header 元素。脚本可能加载得太早了，或者 DOM 还没渲染。");
    console.groupEnd();
    return;
  }

  // =========================================================
  // 1. 记录初始瞬间状态
  // =========================================================
  var initScroll = window.scrollY || document.documentElement.scrollTop;
  var initClass = header.className;
  
  console.log(`[0ms] 脚本启动瞬间 | ScrollY: ${initScroll} | Class: "${initClass}"`);
  
  if (initScroll > 0 && !initClass.includes('nav-fixed')) {
    console.warn(`%c ⚠️ 发现问题区间！页面在滚动位置 ${initScroll}，但类名依然是 "${initClass}" (透明背景)`, "color: orange; font-weight: bold;");
  }

  // =========================================================
  // 2. 监听类名变化 (MutationObserver)
  // =========================================================
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'class') {
        var t = (performance.now() - startTime).toFixed(0);
        var cls = header.className;
        var s = window.scrollY || document.documentElement.scrollTop;
        
        // 打印带颜色的日志
        var style = "color: #333";
        if (cls.includes('nav-fixed')) style = "color: green; font-weight: bold";
        if (cls.includes('nav-visible')) style = "color: blue";
        
        console.log(`[${t}ms] 🎨 类名变更 | Scroll: ${s} | NewClass: "%c${cls}%c"`, style, "color: #333");
      }
    });
  });
  
  observer.observe(header, { attributes: true, attributeFilter: ['class'] });

  // =========================================================
  // 3. 轮询滚动位置 (追踪浏览器什么时候恢复滚动)
  // =========================================================
  var lastScroll = initScroll;
  var intervalCount = 0;
  
  var poller = setInterval(function() {
    var now = (performance.now() - startTime).toFixed(0);
    var currentScroll = window.scrollY || document.documentElement.scrollTop;
    
    // 如果滚动位置发生了“突变”（比如浏览器突然恢复了位置）
    if (currentScroll !== lastScroll) {
      console.log(`[${now}ms] 📜 滚动位置突变! ${lastScroll} -> ${currentScroll}`);
      
      // 在滚动突变的瞬间，检查一下类名对不对
      if (currentScroll > 56 && !header.classList.contains('nav-fixed')) {
         console.warn(`%c ❌ 严重滞后！滚动条已恢复到 ${currentScroll}，但类名仍未包含 nav-fixed！`, "background: yellow; color: red");
      }
      
      lastScroll = currentScroll;
    }
    
    intervalCount++;
    if (intervalCount > 100) { // 监控 1 秒后自动停止
      clearInterval(poller);
      console.log("🏁 监控结束");
      console.groupEnd();
    }
  }, 10); // 每 10ms 检查一次

})();