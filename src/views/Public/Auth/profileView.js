import { useAuthStore } from '@/stores/auth/auth'
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toast-notification'
export function useProfileView() {
  const store = useAuthStore()

  const toast = useToast()

  const formRef = ref()

  const selectOptions = ref({
    companies: [],
    departements: [],
    positions: [],
    levels: [],
    users: [],
  })

  const bloodTypes = [
    { value: 'a', label: 'A', color: 'text-success' },
    { value: 'b', label: 'B', color: 'text-primary' },
    { value: 'o', label: 'O', color: 'text-info' },
    { value: 'ab', label: 'AB', color: 'text-error' },
  ]

  const maritalStatuses = [
    { value: 'single', label: 'lajang' },
    { value: 'married', label: 'sudah menikah' },
    { value: 'widow', label: 'janda' },
    { value: 'widower', label: 'duda' },
  ]

  const religions = [
    { value: 'islam', label: 'islam' },
    { value: 'protestan', label: 'protestan' },
    { value: 'khatolik', label: 'khatolik' },
    { value: 'hindu', label: 'hindu' },
    { value: 'buddha', label: 'buddha' },
    { value: 'khonghucu', label: 'khonghucu' },
  ]

  const initFormData = () => ({
    company_id: '',
    name: '',
    nip: '',
    email: '',
    password: '',
    email_verified_at: '',
    avatar: '',
    avatar_file: null,
    status: '',
    details: {
      phone: '',
      placebirth: '',
      datebirth: '',
      gender: '',
      blood: '',
      marital_status: '',
      religion: '',
    },
    address: {
      identity_type: '',
      identity_numbers: '',
      province: '',
      city: '',
      citizen_address: '',
      residential_address: '',
    },
    employee: {
      departement_id: '',
      job_position_id: '',
      job_level_id: '',
      approval_line_id: '',
      approval_manager_id: '',
      join_date: '',
      sign_date: '',
      bank_name: '',
      bank_number: '',
      bank_holder: '',
    },
    salaries: {
      basic_salary: null,
      payment_type: null,
    },
  })

  const formData = ref(initFormData())

  const LOAD_INITIAL_DATA = async () => {
    try {
      const res = await store.GET_PROFILE_ACTION()
      if (res?.user) {
        formData.value = { ...formData.value, ...res.user }
        await LOAD_FORM_ATTRIBUTE()
      } else {
        throw new Error('Data user tidak ditemukan')
      }
    } catch (err) {
      toast.error('Gagal memuat data profil.')
      console.error(err)
    }
  }

  const LOAD_FORM_ATTRIBUTE = async () => {
    try {
      const res = await store.GET_FORM_PROFILE_ATTRIBUTE()
      if (res?.status === 200 && res.data?.form) {
        const { form } = res.data
        console.log(form);

        selectOptions.value = {
          companies: form.companies,
          departements: form.departements,
          positions: form.job_positions,
          levels: form.job_levels,
          users: form.users,
        }
      } else {
        throw new Error('Data form tidak ditemukan')
      }
    } catch (error) {
      toast.error('Gagal memuat data kelengkapan form.')
      console.error(error)
    }
  }

  const HANDLE_SUBMIT = async () => {
    const { valid } = await formRef.value.validate()
    if (!valid) {
      toast.warning('Periksa kembali input yang belum valid.')
      return
    }

    try {
      const res = await store.POST_PROFILE_ACTION(formData.value)
      toast.success('Profil berhasil diperbarui!')
      console.log(res)
    } catch (error) {
      toast.error('Gagal memperbarui profil.')
      console.error(error)
    }
  }

  return {
    store,
    toast,
    formRef,
    selectOptions,
    bloodTypes,
    maritalStatuses,
    religions,
    formData,
    LOAD_INITIAL_DATA,
    LOAD_FORM_ATTRIBUTE,
    HANDLE_SUBMIT
  }
}
