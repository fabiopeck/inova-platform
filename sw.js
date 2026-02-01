// ----------------------------------------------------
// SERVICE WORKER COMPLETO PARA INOVA CNH
// Cache + Offline + Atualização + Push Notifications
// ----------------------------------------------------

// Nome do cache
const CACHE_NAME = 'inovacnh-cache-v1';

// Arquivos que serão armazenados no cache
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/app.js',
  '/styles.css',

  // Ícones do PWA
  '/icon-192.png',
  '/icon-512.png',
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Arquivos adicionados ao cache');
        return cache.addAll(FILES_TO_CACHE);
      })
  );

  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Service Worker ativado');

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// Intercepta todas as requisições para usar cache/offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(resp => {
        return resp || fetch(event.request);
      })
      .catch(() => caches.match('/index.html'))
  );
});

// ----------------------------------------------------
//  NOTIFICAÇÕES PUSH
// ----------------------------------------------------

// Quando o push chega
self.addEventListener('push', function(event) {
  console.log('[SW] Push recebido:', event.data ? event.data.text() : 'Sem mensagem');

  const options = {
    body: event.data ? event.data.text() : 'Você tem uma nova notificação!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification('INOVA CNH', options)
  );
});

// Quando o usuário clica na notificação
self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Notificação clicada');
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});
