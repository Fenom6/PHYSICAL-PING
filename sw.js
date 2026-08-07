/* Physical Ping service worker
   - ナビゲーション(index.html): network-first（更新を素早く反映、オフライン時はキャッシュ）
   - その他のGET(CDN/フォント/アイコン): cache-first + ランタイムキャッシュ
   - api.anthropic.com は絶対にキャッシュしない */
var CACHE='pping-v31-1';
var PRECACHE=[
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js'
];

self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c){return c.addAll(PRECACHE);})
      .then(function(){return self.skipWaiting();})
  );
});

self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    }).then(function(){return self.clients.claim();})
  );
});

self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var url=new URL(e.request.url);
  if(url.hostname==='api.anthropic.com')return;

  /* ページ本体は network-first */
  if(e.request.mode==='navigate'){
    e.respondWith(
      fetch(e.request).then(function(resp){
        var clone=resp.clone();
        caches.open(CACHE).then(function(c){c.put(e.request,clone);});
        return resp;
      }).catch(function(){
        return caches.match(e.request).then(function(r){return r||caches.match('./index.html');});
      })
    );
    return;
  }

  /* アセットは cache-first */
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached)return cached;
      return fetch(e.request).then(function(resp){
        if(resp&&resp.status===200&&(resp.type==='basic'||resp.type==='cors')){
          var clone=resp.clone();
          caches.open(CACHE).then(function(c){c.put(e.request,clone);});
        }
        return resp;
      });
    })
  );
});
