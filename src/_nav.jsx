/**
 * Sidebar Navigation Configuration
 *
 * Defines the structure and content of the sidebar navigation menu.
 * Supports multiple navigation component types from CoreUI React:
 * - CNavItem: Single navigation link
 * - CNavGroup: Collapsible group of links
 * - CNavTitle: Section title/divider
 *
 * @module _nav
 */

import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBug,
  cilCalculator,
  cilChartPie,
  cilDescription,
  cilExternalLink,
  cilLockLocked,
  cilNotes,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilAddressBook,
  cilBook,
  cilBlur,
  cilGroup,
  cilSoccer,
  cilWalk,
  cilMedicalCross
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

/**
 * Navigation menu structure array
 *
 * @type {Array<Object>}
 * @property {React.ComponentType} component - CoreUI nav component (CNavItem, CNavGroup, CNavTitle)
 * @property {string} name - Display text for the nav item
 * @property {string} [to] - Internal route path (for CNavItem with routing)
 * @property {string} [href] - External URL (for CNavItem with external links)
 * @property {React.ReactNode} [icon] - Icon element to display
 * @property {Object} [badge] - Optional badge configuration
 * @property {string} badge.color - Badge color (info, danger, success, etc.)
 * @property {string} badge.text - Badge text content
 * @property {Array<Object>} [items] - Child items for CNavGroup
 *
 * @example
 * // Simple navigation item
 * {
 *   component: CNavItem,
 *   name: 'Dashboard',
 *   to: '/dashboard',
 *   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
 * }
 *
 * @example
 * // Navigation group with children
 * {
 *   component: CNavGroup,
 *   name: 'Components',
 *   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
 *   items: [
 *     {
 *       component: CNavItem,
 *       name: 'Cards',
 *       to: '/components/cards',
 *     },
 *   ],
 * }
 *
 * @example
 * // Section title
 * {
 *   component: CNavTitle,
 *   name: 'UI Elements',
 * }
 */
const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'User Panel',
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/admin/users',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    badge: {
      color: 'warning',
      text: 'Check',
    },
  },
  {
    component: CNavTitle,
    name: 'Category Panel',
  },
  {
    component: CNavItem,
    name: 'Add Category',
    to: '/admin/add-category',
    icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Categories',
    to: '/admin/categories',
    icon: <CIcon icon={cilBlur} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Product Panel',
  },
  {
    component: CNavItem,
    name: 'Add Products',
    to: '/admin/add-product',
    icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Products',
    to: '/admin/products',
    icon: <CIcon icon={cilBlur} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Variants',
    to: '/admin/product-variants',
    icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Order Panel',
  },
  {
    component: CNavItem,
    name: 'Orders',
    to: '/admin/orders',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    badge: {
      color: 'success',
      text: 'Check',
    },
  },
  {
    component: CNavTitle,
    name: 'Control Panel',
  },
  {
    component: CNavItem,
    name: ' Add Admins',
    to: '/admin/control-panel/add-admins',
    icon: <CIcon icon={cilWalk} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Admins',
    to: '/admin/control-panel/admins',
    icon: <CIcon icon={cilWalk} customClassName="nav-icon" />,
  },
  
 
]

export default _nav
