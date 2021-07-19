export const pathBreadcrumbPair:{[index:string] : {breadcrumbs: string[]}} = {
    '/dashboard': {breadcrumbs: ['Overview']},
    '/dashboard/students': {breadcrumbs: ['Student','Student List']},
    '/dashboard/students/[id]': {breadcrumbs: ['Student', 'Student List', 'Detail']},
    '/dashboard/teachers': {breadcrumbs: ['Teacher', 'Teacher List']},
    '/dashboard/teachers/[id]': {breadcrumbs: ['Teacher', 'Teacher List', 'Detail']},
    '/dashboard/courses': {breadcrumbs: ['Course', 'All Courses']},
    '/dashboard/courses/add-course': {breadcrumbs: ['Course', 'Add Course']},
    '/dashboard/courses/edit-course': {breadcrumbs: ['Course', 'Edit Course']},
    '/dashboard/message': {breadcrumbs: ['Message']}
}

