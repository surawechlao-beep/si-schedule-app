// firebase-messaging-sw.js
// Service Worker สำหรับ Firebase Cloud Messaging

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB2MyuGCGuR3kDPIl-uP1o-LV5C2PGtv9E",
  authDomain: "si-schedule-2026.firebaseapp.com",
  projectId: "si-schedule-2026",
  storageBucket: "si-schedule-2026.firebasestorage.app",
  messagingSenderId: "867056764656",
  appId: "1:867056764656:web:5af9ac0ee589dcc8256435"
});

const messaging = firebase.messaging();

// รับ notification เมื่อแอพปิดอยู่ (background)
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background message:', payload);

  const { title, body, icon } = payload.notification || {};
  const notificationTitle = title || '📅 SI Schedule';
  const notificationOptions = {
    body: body || 'มีการอัปเดต Schedule',
    icon: icon || '/si-schedule-app/icon-192.png',
    badge: '/si-schedule-app/icon-192.png',
    tag: 'si-schedule',
    renotify: true,
    data: payload.data || {},
    actions: [
      { action: 'open', title: '📅 เปิดแอพ' },
      { action: 'close', title: 'ปิด' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// กดที่ notification แล้วเปิดแอพ
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'close') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      const appUrl = '/si-schedule-app/';
      for (const client of clientList) {
        if (client.url.includes('si-schedule-app') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(appUrl);
    })
  );
});
