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
    user_id: '',
    status_in: '',
    status_out: '',
    start: null,
    end: null,
    createdAt: null,
    updatedAt: null,
  }
}
export function stateForm() {
  return {
    user_id: null,
    user_timework_schedule_id: null,
    time_in: null,
    time_out: null,
    type_in: null,
    type_out: null,
    lat_in: null,
    lat_out: null,
    long_in: null,
    long_out: null,
    image_in: null,
    image_out: null,
    status_in: null,
    status_out: null,
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
export function stateDialog() {
  return {
    show: false,
    variant: null,
    maxwidth: 400,
  }
}
