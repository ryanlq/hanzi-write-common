var GHPATH = '/';
var APP_PREFIX = 'hanzi_study'     // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = 'version_01'              // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [                            // Add URL you want to cache in this list.
`${GHPATH}/index.html`,
`${GHPATH}/libs/dexie.js`, 
`${GHPATH}/write.html`,
`${GHPATH}/pinyin.html`,  
`${GHPATH}/essay.html`,                 
`${GHPATH}/libs/hanzi-writer.js`,                  
`${GHPATH}/libs/default-passive-events.js`,                  
`${GHPATH}/js/db.js`, 
`${GHPATH}/js/commonwords.js` ,
`${GHPATH}/js/Speaker.js`,
`${GHPATH}/js/tools.js`,
`${GHPATH}/js/global.js`,
`${GHPATH}/js/hanzi.js`,
`${GHPATH}/js/app.js`,
`${GHPATH}/js/extradatas.js `,
`${GHPATH}/libs/tiny-pinyin.js `,
`${GHPATH}/js/pinyin.data.js`,
`${GHPATH}/js/essay_page.js`,
`${GHPATH}/essay/all_eassy.js `,
`${GHPATH}/favicon.ico`,
`${GHPATH}/css/styles.css`,
`${GHPATH}/css/toggle-radios.css `,
`${GHPATH}/css/essay.css `,
`${GHPATH}/css/fontello.css`,
`${GHPATH}/font/fontello.eot`,
`${GHPATH}/font/fontello.svg`,
`${GHPATH}/font/fontello.ttf`,
`${GHPATH}/font/fontello.woff`,
`${GHPATH}/font/fontello.woff2`,
`${GHPATH}/imgs/speak.jpg`,
`${GHPATH}/audios/b.mp3`,
`${GHPATH}/audios/p.mp3`,
`${GHPATH}/audios/m.mp3`,
`${GHPATH}/audios/f.mp3`,
`${GHPATH}/audios/d.mp3`,
`${GHPATH}/audios/t.mp3`,
`${GHPATH}/audios/n.mp3`,
`${GHPATH}/audios/l.mp3`,
`${GHPATH}/audios/g.mp3`,
`${GHPATH}/audios/k.mp3`,
`${GHPATH}/audios/h.mp3`,
`${GHPATH}/audios/j.mp3`,
`${GHPATH}/audios/q.mp3`,
`${GHPATH}/audios/x.mp3`,
`${GHPATH}/audios/zh.mp3`,
`${GHPATH}/audios/ch.mp3`,
`${GHPATH}/audios/sh.mp3`,
`${GHPATH}/audios/r.mp3`,
`${GHPATH}/audios/z.mp3`,
`${GHPATH}/audios/c.mp3`,
`${GHPATH}/audios/s.mp3`,
`${GHPATH}/audios/y.mp3`,
`${GHPATH}/audios/w.mp3`,
`${GHPATH}/audios/a.mp3`,
`${GHPATH}/audios/o.mp3`,
`${GHPATH}/audios/e.mp3`,
`${GHPATH}/audios/i.mp3`,
`${GHPATH}/audios/u.mp3`,
`${GHPATH}/audios/v.mp3`,
`${GHPATH}/audios/ai.mp3`,
`${GHPATH}/audios/ei.mp3`,
`${GHPATH}/audios/ui.mp3`,
`${GHPATH}/audios/ao.mp3`,
`${GHPATH}/audios/ou.mp3`,
`${GHPATH}/audios/iu.mp3`,
`${GHPATH}/audios/ie.mp3`,
`${GHPATH}/audios/ve.mp3`,
`${GHPATH}/audios/er.mp3`,
`${GHPATH}/audios/an.mp3`,
`${GHPATH}/audios/en.mp3`,
`${GHPATH}/audios/in.mp3`,
`${GHPATH}/audios/un.mp3`,
`${GHPATH}/audios/vn.mp3`,
`${GHPATH}/audios/ang.mp3`,
`${GHPATH}/audios/eng.mp3`,
`${GHPATH}/audios/ing.mp3`,
`${GHPATH}/audios/ong.mp3`
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