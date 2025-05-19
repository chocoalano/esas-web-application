const useRules = () => {
  return {
    required: (field = 'Field ini') => {
      return (v) => (!!v ? true : `${field} wajib diisi`);
    },

    minLength: (min, field = 'Field ini') => (v) => {
      return (v && v.length >= min) || `${field} minimal ${min} karakter`
    },

    maxLength: (max, field = 'Field ini') => (v) => {
      return (v && v.length <= max) || `${field} maksimal ${max} karakter`
    },

    email: (v) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return pattern.test(v) || 'Format email tidak valid'
    },

    numeric: (field = 'Field ini') => (v) => {
      return (!v || /^[0-9]+$/.test(v)) || `${field} harus berupa angka`
    },

    min: (min, field = 'Field ini') => (v) => {
      return (!v || Number(v) >= min) || `${field} minimal bernilai ${min}`
    },

    max: (max, field = 'Field ini') => (v) => {
      return (!v || Number(v) <= max) || `${field} maksimal bernilai ${max}`
    },

    sameAs: (compareTo, message = 'Nilai tidak cocok') => (v) => {
      return v === compareTo || message
    },

    regex: (pattern, message = 'Format tidak valid') => (v) => {
      return pattern.test(v) || message
    },

    timeFormat: (v) => {
      return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(v) || 'Format waktu harus HH:mm atau HH:mm:ss'
    },
  }
}

export default useRules
