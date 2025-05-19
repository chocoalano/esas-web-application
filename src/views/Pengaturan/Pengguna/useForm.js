// useForm.js
import useRules from '@/plugins/validator'
import { ref, watch, computed } from 'vue'

export function useForm(props, emit) {
  const rules = useRules()
  const formRef = ref(null)

  const formData = ref({
    company_id: props.data.company_id,
    name: props.data.name,
    password: '', // Inisialisasi password dengan string kosong
    nip: props.data.nip,
    email: props.data.email,
    email_verified_at: props.data.email_verified_at,
    avatar: '',
    avatar_file: null,
    status: props.data.status,
    details: {
      phone: props.data.details.phone,
      placebirth: props.data.details.placebirth,
      datebirth: props.data.details.datebirth,
      gender: props.data.details.gender,
      blood: props.data.details.blood,
      marital_status: props.data.details.marital_status,
      religion: props.data.details.religion,
    },
    address: {
      identity_type: props.data.address.identity_type,
      identity_numbers: props.data.address.identity_numbers,
      province: props.data.address.province,
      city: props.data.address.city,
      citizen_address: props.data.address.citizen_address,
      residential_address: props.data.address.residential_address,
    },
    employee: {
      departement_id: props.data.employee.departement_id,
      job_position_id: props.data.employee.job_position_id,
      job_level_id: props.data.employee.job_level_id,
      approval_line_id: props.data.employee.approval_line_id,
      approval_manager_id: props.data.employee.approval_manager_id,
      join_date: props.data.employee.join_date,
      sign_date: props.data.employee.sign_date,
      bank_name: props.data.employee.bank_name,
      bank_number: props.data.employee.bank_number,
      bank_holder: props.data.employee.bank_holder,
    },
    salary: {
      basic_salary: props.data.salaries.basic_salary,
      payment_type: props.data.salaries.payment_type,
    },
  })

  const isEditMode = computed(() => !!props.id)

  const handleCancel = () => {
    emit('cancel')
  }

  const handleConfirm = async () => {
    if (!formRef.value) return
    const { valid, errors } = await formRef.value.validate()
    console.log('Valid?', valid, 'Errors:', errors)
    if (!valid) return
    emit('confirm', { form: formData.value, id: props.id })
  }

  watch(
    () => props.data,
    (newVal) => {
      formData.value = { ...newVal }
    },
    { immediate: true },
  )

  return {
    formRef,
    formData,
    isEditMode,
    handleCancel,
    handleConfirm,
    rules,
  }
}
