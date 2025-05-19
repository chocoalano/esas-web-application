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
    permit_type: '',
    permit_numbers: '',
    workday: '',
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
    selectItemCompany: [],
    selectItemDepartement: [],
    formData: {
      company_id: null,
      departement_id: null,
      user_id: null,
      permittype_id: null,
      schedule_id: null,
      permit_numbers: null,
      timein_adjust: null,
      timeout_adjust: null,
      current_shift_id: null,
      adjust_shift_id: null,
      start_date: null,
      end_date: null,
      start_time: null,
      end_time: null,
      notes: '',
      file: null,
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
