export function stateTable() {
  return {
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
    selected: [],
    serverItems: [],
    sortBy: [],
  }
}
export function stateTableFilters() {
  return {
    company_id: '',
    departement_id: '',
    timework_id: '',
    workday: '',
    user_id: '',
    start: null,
    end: null,
    createdAt: null,
    updatedAt: null,
  }
}
export function stateForm() {
  return {
    isEdit: false,
    idData: null,
    formData: {
      company_id: '',
      departement: '',
      user_id: [],
      time_work_id: '',
      work_day_start: '',
      work_day_finish: '',
      dayoff: [],
    },
    dialog: {
      show: false,
      variant: null,
      maxwidth: 400,
    },
  }
}
export function stateAlert() {
  return {
    show: false,
    title: '',
    message: '',
    type: 'error',
  }
}
