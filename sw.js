var C="soc10a-v3";
self.addEventListener("install",function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(["./","./index.html","./manifest.webmanifest","./icon.svg"]).then(function(){return c.add("./ost.mp3").catch(function(){})})}));self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!=C}).map(function(x){return caches.delete(x)}))}));self.clients.claim()});
/* аудио просит файл кусками (Range) — отдаём нужный кусок из кеша, иначе без интернета музыка не играет */
function rng(r){return caches.match(r.url).then(function(m){if(!m)return fetch(r);return m.arrayBuffer().then(function(b){
 var n=b.byteLength,x=/bytes=(\d*)-(\d*)/.exec(r.headers.get("range")||""),s=0,e=n-1;
 if(x){if(x[1]===""&&x[2]!==""){s=Math.max(0,n-+x[2])}else{s=x[1]?+x[1]:0;e=x[2]?Math.min(+x[2],n-1):n-1}}
 if(s>e||s>=n)return new Response(null,{status:416,headers:{"Content-Range":"bytes */"+n}});
 return new Response(b.slice(s,e+1),{status:206,statusText:"Partial Content",headers:{"Content-Type":m.headers.get("Content-Type")||"audio/mpeg","Content-Length":String(e-s+1),"Content-Range":"bytes "+s+"-"+e+"/"+n,"Accept-Ranges":"bytes"}})})})}
self.addEventListener("fetch",function(e){var r=e.request;if(r.method!="GET")return;
 if(r.headers.has("range")){e.respondWith(rng(r));return}
 e.respondWith(fetch(r).then(function(x){var c=x.clone();caches.open(C).then(function(k){k.put(r,c)});return x}).catch(function(){return caches.match(r)}))});
