/**
 * 导航辅助脚本 - 用于实现页面间的无缝跳转
 */

// 检查是否在iframe中运行
const isInIframe = window.self !== window.top;

// 页面导航函数
function navigateTo(href) {
    if (isInIframe) {
        // 如果在iframe中，向父窗口发送消息
        window.parent.postMessage({ action: 'navigate', href: href }, '*');
    } else {
        // 如果不在iframe中，直接导航
        window.location.href = href;
    }
}

// 重写所有链接的点击行为
function setupLinkInterception() {
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('http')) {
                e.preventDefault();
                navigateTo(href);
            }
        });
    });
}

// 页面加载完成后设置链接拦截
document.addEventListener('DOMContentLoaded', setupLinkInterception);

// 监听返回按钮点击
document.addEventListener('DOMContentLoaded', function() {
    const backButtons = document.querySelectorAll('[onclick="history.back()"]');
    backButtons.forEach(button => {
        button.removeAttribute('onclick');
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // 返回上一页的逻辑，这里简化为返回首页
            navigateTo('home.html');
        });
    });
});

// 导出导航函数，使其可以被其他脚本使用
window.navigateTo = navigateTo;