import { versionAtLeast } from '../telegram';

// В Telegram данные хранятся в CloudStorage: localStorage внутри Telegram
// на iOS и в некоторых настольных версиях может очищаться после перезапуска.
// Ключи CloudStorage: только латиница, цифры, «_» и «-».

function cloud() {
  return versionAtLeast('6.9') ? window.Telegram.WebApp.CloudStorage : null;
}

export function getItem(key) {
  const c = cloud();
  if (c) {
    return new Promise((resolve) => {
      c.getItem(key, (err, value) => resolve(err ? null : value || null));
    });
  }
  try {
    return Promise.resolve(localStorage.getItem(key));
  } catch {
    return Promise.resolve(null);
  }
}

export function setItem(key, value) {
  const c = cloud();
  if (c) {
    c.setItem(key, value, () => {});
    return;
  }
  try {
    localStorage.setItem(key, value);
  } catch {
    // Хранилище недоступно (приватный режим) — просто не запоминаем.
  }
}
