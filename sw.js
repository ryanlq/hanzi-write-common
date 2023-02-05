var APP_PREFIX = 'hanzi_study'     // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = 'version_01'              // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [                            // Add URL you want to cache in this list.
'./index.html',
'./libs/dexie.js', 
'./write.html',
'./pinyin.html',  
'./essay.html',                 
'./libs/hanzi-writer.js',                  
'./libs/default-passive-events.js',                  
'./js/db.js', 
'./js/commonwords.js' ,
'./js/Speaker.js' ,
'./js/tools.js' ,
'./js/global.js' ,
'./js/hanzi.js' ,
'./js/app.js' ,
'./js/pinyin.data.js',
'./js/essay_page.js',
'./favicon.ico',
'./css/styles.css',
'./css/fontello.css',
'./font/fontello.eot',
'./font/fontello.svg',
'./font/fontello.ttf',
'./font/fontello.woff',
'./font/fontello.woff2',
'./imgs/speak.jpg',
'./audios/b.mp3',
'./audios/p.mp3',
'./audios/m.mp3',
'./audios/f.mp3',
'./audios/d.mp3',
'./audios/t.mp3',
'./audios/n.mp3',
'./audios/l.mp3',
'./audios/g.mp3',
'./audios/k.mp3',
'./audios/h.mp3',
'./audios/j.mp3',
'./audios/q.mp3',
'./audios/x.mp3',
'./audios/zh.mp3',
'./audios/ch.mp3',
'./audios/sh.mp3',
'./audios/r.mp3',
'./audios/z.mp3',
'./audios/c.mp3',
'./audios/s.mp3',
'./audios/y.mp3',
'./audios/w.mp3',
'./audios/a.mp3',
'./audios/o.mp3',
'./audios/e.mp3',
'./audios/i.mp3',
'./audios/u.mp3',
'./audios/v.mp3',
'./audios/ai.mp3',
'./audios/ei.mp3',
'./audios/ui.mp3',
'./audios/ao.mp3',
'./audios/ou.mp3',
'./audios/iu.mp3',
'./audios/ie.mp3',
'./audios/ve.mp3',
'./audios/er.mp3',
'./audios/an.mp3',
'./audios/en.mp3',
'./audios/in.mp3',
'./audios/un.mp3',
'./audios/vn.mp3',
'./audios/ang.mp3',
'./audios/eng.mp3',
'./audios/ing.mp3',
'./audios/ong.mp3'
]

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { // if cache is available, respond with cache
        return request
      } else {       // if there are no cache, try fetching request
        console.log( e.request.url + "is not cached")
        return fetch(e.request)
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  )
})

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(URLS)
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] )
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})