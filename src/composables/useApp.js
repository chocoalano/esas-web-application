import { useAuthStore } from "@/stores/auth/auth";
import dayjs from 'dayjs'

export function usePermissionCheck() {
  const store = useAuthStore();
  const permissionCheck = (str) => {
    if (!Array.isArray(store.permission)) {
      console.warn("Permission data is not an array:", store.permission);
      return false;
    }
    return store.permission.includes(str);
  };

  return { permissionCheck };
}

export function useAppDebug() {
  return import.meta.env.VITE_APP_DEBUG;
}
export function useAssetUrl() {
  return import.meta.env.VITE_BASE_URL_ASSETS;
}
export function useAssetDirectory() {
  return import.meta.env.VITE_BASE_DIRECTORY_ASSETS;
}
export function useAssetDefaultImg() {
  return import.meta.env.VITE_BASE_DEFAULT_ASSETS;
}

export const formatDay = (day) => dayjs(day, 'YYYY-MM-DD').format('YYYY-MM-DD')

export function formatDateToYMD(date) {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const formatTime = (val) => {
  if (!val) return '00:00:00'
  if (typeof val === 'string') {
    const parsed = dayjs(`2000-01-01T${val}`)
    return parsed.isValid() ? parsed.format('HH:mm:ss') : '00:00:00'
  }
  // Jika val adalah Date object
  const parsed = dayjs(val)
  return parsed.isValid() ? parsed.format('HH:mm:ss') : '00:00:00'
}
