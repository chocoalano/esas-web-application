// file: userFormData.ts (atau .js)
export default function userShow() {
  return {
    company_id: '',
    name: '',
    nip: '',
    email: '',
    email_verified_at: '',
    avatar: '',
    status: '',
    device_id: '',
    created_at: '',
    updated_at: '',
    company: {
      name: '',
      latitude: '',
      longitude: '',
      radius: '',
      full_address: ''
    },
    details: {
      user_id: '',
      phone: '',
      placebirth: '',
      datebirth: '',
      gender: '',
      blood: '',
      marital_status: '',
      religion: ''
    },
    address: {
      user_id: '',
      identity_type: '',
      identity_numbers: '',
      province: '',
      city: '',
      citizen_address: '',
      residential_address: ''
    },
    salaries: {
      user_id: '',
      basic_salary: '',
      payment_type: ''
    },
    families: [],
    formal_educations: [],
    informal_educations: [],
    work_experiences: [],
    employee: {
      user_id: '',
      departement_id: '',
      job_position_id: '',
      job_level_id: '',
      approval_line_id: '',
      approval_manager_id: '',
      join_date: '',
      sign_date: '',
      resign_date: '',
      bank_name: '',
      bank_number: '',
      bank_holder: '',
      saldo_cuti: '',
      approval_line: {
        name: '',
        nip: ''
      },
      approval_manager: {
        name: '',
        nip: ''
      },
      departement: {
        name: '',
      },
      job_position: {
        name: '',
      },
      job_level: {
        name: '',
      },
    }
  }
}
