// import React from 'react'
// import { useLocation } from 'react-router-dom'

// import { routes } from '../routes'

// import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

// const AppBreadcrumb = () => {
//   const currentLocation = useLocation().pathname
//   console.log('Current location:', currentLocation) // Debugging log

//   // const getRouteName = (pathname, routes) => {
//   //   const currentRoute = routes.find((route) => route.path === pathname)
//   //   return currentRoute ? currentRoute.name : false
//   // }

//   const getRouteName = (pathname, routes) => {
//   const currentRoute = routes.find((route) =>
//     route.path && matchPath(route.path, pathname)
//   )

//   return currentRoute ? currentRoute.name : false
// }

//   const getBreadcrumbs = (location) => {
//     const breadcrumbs = []
//     location.split('/').reduce((prev, curr, index, array) => {
//       const currentPathname = `${prev}/${curr}`
//       const routeName = getRouteName(currentPathname, routes)
//       routeName &&
//         breadcrumbs.push({
//           pathname: currentPathname,
//           name: routeName,
//           active: index + 1 === array.length ? true : false,
//         })
//       return currentPathname
//     })
//     return breadcrumbs
//   }

//   const breadcrumbs = getBreadcrumbs(currentLocation)

//   return (
//     <CBreadcrumb className="my-0">
//       <CBreadcrumbItem href="/">Home</CBreadcrumbItem>
//       {breadcrumbs.map((breadcrumb, index) => {
//         return (
//           <CBreadcrumbItem
//             {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
//             key={index}
//           >
//             {breadcrumb.name}
//           </CBreadcrumbItem>
//         )
//       })}
//     </CBreadcrumb>
//   )
// }

// export default React.memo(AppBreadcrumb)


import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
  const { pathname } = useLocation()

  const breadcrumbNames = {
    '/admin/dashboard': 'Dashboard',
    '/admin/users': 'Users',

    '/admin/categories': 'Categories',
    '/admin/add-category': 'Add Categories',

    '/admin/products': 'Products',
    '/admin/add-product': 'Add Products',

    '/admin/product-variants': 'Variants',
    '/admin/orders': 'Orders',

    '/admin/control-panel/add-admins': 'Add Admins',
    '/admin/control-panel/admins': 'Admins',
  }

  const getCurrentName = () => {
    // Exact static paths
    if (breadcrumbNames[pathname]) {
      return breadcrumbNames[pathname]
    }

    // Update Category
    if (pathname.startsWith('/admin/update-category/')) {
      return 'Update Categories'
    }

    // Update Product
    if (pathname.startsWith('/admin/update-product/')) {
      return 'Update Products'
    }

    // Add Variant
    if (pathname.match(/^\/admin\/product-variants\/[^/]+\/add$/)) {
      return 'Add Variant'
    }

    // Update Variant
    if (
      pathname.match(
        /^\/admin\/product-variants\/[^/]+\/edit\/[^/]+$/,
      )
    ) {
      return 'Update Variant'
    }

    // View Product Variants
    if (pathname.startsWith('/admin/product-variants/')) {
      return 'Variants'
    }

    // Update Admin
    if (
      pathname.startsWith(
        '/admin/control-panel/update-admin/',
      )
    ) {
      return 'Update Admins'
    }

    return 'Dashboard'
  }

  const currentName = getCurrentName()

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem>
        <Link to="/admin/dashboard">
          Home
        </Link>
      </CBreadcrumbItem>

      <CBreadcrumbItem active>
        {currentName}
      </CBreadcrumbItem>
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)