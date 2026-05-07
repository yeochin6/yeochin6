// 缓存名称（每次更新时修改版本号）
const CACHE_NAME = 'yeochin-pwa-v1';

// 需要预先缓存的页面和资源（根据你的实际文件调整）
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/JMP_Pro.html',
  '/Over_Time.html',
  '/Unit_Trans.html'
  // 如果你有 CSS/JS 文件，请在这里添加，例如：
  // '/style.css',
  // '/script.js'
];

// 安装事件：预缓存关键资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('预缓存资源列表', PRECACHE_URLS);
        return cache.addAll(PRECACHE_URLS);
      })
      .catch(err => console.error('预缓存失败:', err))
  );
  // 激活新的 Service Worker
  self.skipWaiting();
});

// 激活事件：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('删除旧缓存:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 请求拦截：缓存优先，回退网络，并动态缓存新请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(networkResponse => {
          // 只缓存同源、GET 请求且非浏览器扩展的请求
          if (event.request.method === 'GET' &&
              event.request.url.startsWith(self.location.origin)) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // 完全离线且无缓存时，可返回自定义离线页面（可选）
        // 这里简单返回一个提示文本
        return new Response('您当前处于离线状态，请检查网络连接。', {
          status: 200,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});