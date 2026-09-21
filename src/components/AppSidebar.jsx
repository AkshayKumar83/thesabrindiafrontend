/**
 * AppSidebar Component
 *
 * Collapsible navigation sidebar with branding, menu items, and toggle controls.
 *
 * Features:
 * - Redux-controlled visibility state
 * - Unfoldable/narrow mode for more screen space
 * - Brand logo with full and narrow variants
 * - Close button for mobile devices
 * - Footer with toggle button
 * - Dark color scheme
 * - Fixed positioning
 *
 * @component
 * @example
 * return (
 *   <AppSidebar />
 * )
 */

import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CButton,
  CCloseButton,
  CFooter,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

// import fullLogo from 'src/assets/brand/sabrLogo.jpeg'
// import smallLogo from 'src/assets/brand/sabrLogo.jpeg'

import fullLogo from 'src/assets/brand/logoSabr.jpeg'
import smallLogo from 'src/assets/brand/logoSabr.jpeg'

// sidebar nav config
import navigation from '../_nav'
import { cilLockLocked } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import ConfirmationModal from '../admin/common/ConfirmationModal'

/**
 * AppSidebar functional component
 *
 * Manages sidebar state with Redux:
 * - sidebarShow: Controls sidebar visibility
 * - sidebarUnfoldable: Controls narrow/wide mode
 *
 * Renders navigation from _nav.js configuration file.
 * Memoized to prevent unnecessary re-renders.
 *
 * @returns {React.ReactElement} Sidebar with navigation
 */
const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [logOutVisible, setLogOutVisible] = useState(false)

  const navigate = useNavigate()

  const handleLogout = () => {
    // Remove JWT token
    localStorage.removeItem('etoken')

    // Navigate to home
    navigate('/')
  }



  return (
    <CSidebar
      className="border-end"
      colorScheme="light"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
       <CSidebarBrand to="/">
  <img
    src={fullLogo}
    alt="The Sabr India"
    className=""
    height={30}
    width={100}
   
  />

  <img
    src={smallLogo}
    alt="The Sabr India"
    className="sidebar-brand-narrow"
    height={30}
  />
</CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CFooter className="px-4">
  <CButton
    color="transparent"
    className="p-0"
    onClick={() => setLogOutVisible(true)}
  >
    <CIcon icon={cilLockLocked} className="me-2" />
    LogOut
  </CButton>
</CFooter>
 <ConfirmationModal
        visible={logOutVisible}
        title="LogOut Confirmation"
        message={`Are you sure you want to LogOut`}
        confirmLabel="LogOut"
        // loading={deletingId !== null}
        onClose={() => setLogOutVisible(false)}
        onConfirm={() => handleLogout()}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
