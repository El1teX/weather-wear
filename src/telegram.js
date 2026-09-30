// Обёртка над Telegram Mini Apps SDK (telegram-web-app.js подключён в index.html).
// Вне Telegram все функции тихо ничего не делают, и приложение работает как обычный сайт.

const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;

/** true, только если приложение открыто внутри Telegram */
export const isTelegram = Boolean(tg && tg.initData);

export function versionAtLeast(version) {
  return Boolean(isTelegram && tg.isVersionAtLeast?.(version));
}

export function initTelegram() {
  if (!isTelegram) return;
  tg.ready();
  tg.expand();
  document.documentElement.classList.add('in-telegram');
}

/** Красит шапку Telegram в цвет неба, а фон — в цвет темы */
export function setChromeColors(headerHex) {
  if (!isTelegram) return;
  try {
    if (versionAtLeast('6.9')) tg.setHeaderColor(headerHex);
    const bg = tg.themeParams?.bg_color;
    if (bg && versionAtLeast('6.1')) tg.setBackgroundColor(bg);
    if (bg && versionAtLeast('7.10')) tg.setBottomBarColor(bg);
  } catch {
    // Старые клиенты могут не поддерживать цвет — не критично.
  }
}

export const haptic = {
  select() {
    if (versionAtLeast('6.1')) tg.HapticFeedback.selectionChanged();
  },
  tap() {
    if (versionAtLeast('6.1')) tg.HapticFeedback.impactOccurred('light');
  },
  success() {
    if (versionAtLeast('6.1')) tg.HapticFeedback.notificationOccurred('success');
  },
  error() {
    if (versionAtLeast('6.1')) tg.HapticFeedback.notificationOccurred('error');
  },
};

/** Показывает системную кнопку «Назад» Telegram. Возвращает функцию, которая её убирает. */
export function showBackButton(onBack) {
  if (!versionAtLeast('6.1')) return () => {};
  tg.BackButton.onClick(onBack);
  tg.BackButton.show();
  return () => {
    tg.BackButton.offClick(onBack);
    tg.BackButton.hide();
  };
}

/** Открывает внешнюю ссылку: в Telegram — через встроенный браузер */
export function openLink(url) {
  if (isTelegram) tg.openLink(url);
  else window.open(url, '_blank', 'noopener');
}

export class LocationError extends Error {
  constructor(reason) {
    super(reason);
    this.reason = reason; // 'denied' | 'unavailable'
  }
}

/**
 * Координаты пользователя. В Telegram (Bot API 8.0+) — через LocationManager,
 * иначе — через геолокацию браузера.
 */
export function requestLocation() {
  return new Promise((resolve, reject) => {
    const lm = versionAtLeast('8.0') ? tg.LocationManager : null;
    if (lm) {
      const get = () => {
        if (!lm.isLocationAvailable) {
          reject(new LocationError('unavailable'));
          return;
        }
        lm.getLocation((data) => {
          if (data) resolve({ latitude: data.latitude, longitude: data.longitude });
          else reject(new LocationError('denied'));
        });
      };
      if (lm.isInited) get();
      else lm.init(get);
      return;
    }

    if (!('geolocation' in navigator)) {
      reject(new LocationError('unavailable'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      (err) => reject(new LocationError(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable')),
      { timeout: 10000, maximumAge: 10 * 60 * 1000 }
    );
  });
}

/** Можно ли открыть настройки доступа к геопозиции внутри Telegram */
export function canOpenLocationSettings() {
  return versionAtLeast('8.0') && Boolean(tg.LocationManager?.isAccessRequested);
}

export function openLocationSettings() {
  if (versionAtLeast('8.0')) tg.LocationManager.openSettings();
}
