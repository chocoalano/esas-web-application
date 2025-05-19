import { ref, watchEffect, onMounted } from 'vue'
import useRules from '@/plugins/validator'
import { useJadwalKerjaStore } from '@/stores/administrasiHR/jadwal_kerja'

export function useForm(props, emit) {
  const store = useJadwalKerjaStore()

  const rules = useRules()
  const selectCompany = ref([])
  const selectDepartemen = ref([])
  const selectUser = ref([])
  const selectTimework = ref([])
  const idData = ref(props.id)

  const formData = ref({
    company_id: props.data.company_id,
    departement: props.data.departement,
    user_id: props.data.user_id,
    time_work_id: props.data.time_work_id,
    work_day_start: props.data.work_day_start,
    work_day_finish: props.data.work_day_finish,
    dayoff: props.data.dayoff,
  })

  const formRef = ref(null)

  const handleCancel = () => emit('cancel')

  const handleConfirm = () => {
    if (formRef.value?.validate()) {
      emit('confirm', {
        form: { ...formData.value },
        id: idData.value,
      })
    }
  }

  watchEffect(() => {
    formData.value = {
      company_id: props.data.company_id,
      departement: props.data.departement,
      user_id: props.data.user_id,
      time_work_id: props.data.time_work_id,
      work_day_start: props.data.work_day_start,
      work_day_finish: props.data.work_day_finish,
      dayoff: props.data.dayoff,
    }
  })

  const getKelengkapanForm = async () => {
    try {
      const [company, departement, user] = await Promise.all([
        store.apiGetCompany(),
        store.apiGetDepartement(formData.value.company_id),
        store.apiGetPengguna(formData.value.company_id, formData.value.departement),
      ])
      selectCompany.value = company.data
      selectDepartemen.value = departement.data
      selectUser.value = user.data
    } catch (error) {
      alert('❌ Gagal memuat data kelengkapan form:', error)
    }
  }

  const onCompanyChange = async (id) => {
    const { data } = await store.apiGetDepartement(id)
    selectDepartemen.value = data
  }

  const onDepartemenChange = async (company_id, id) => {
    const [penggunaRes, jamKerjaRes] = await Promise.all([
      store.apiGetPengguna(company_id, id),
      store.apiGetJamKerja(company_id, id),
    ])
    selectUser.value = penggunaRes.data
    selectTimework.value = jamKerjaRes.data
  }

  onMounted(() => getKelengkapanForm())

  return {
    id: idData,
    formData,
    formRef,
    selectCompany,
    selectDepartemen,
    selectUser,
    selectTimework,
    rules,
    handleCancel,
    handleConfirm,
    onCompanyChange,
    onDepartemenChange,
  }
}
