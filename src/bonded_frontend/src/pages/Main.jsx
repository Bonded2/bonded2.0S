import { Outlet } from "react-router-dom"
import PWAInstallPrompt from '@/components/PWA-Install/PWAInstallPrompt'
import PWAStatus from '@/components/PWA-Install/PWAStatus'

const Main = () => {
  return (
    <>
        <PWAInstallPrompt />
        <PWAStatus />
        <Outlet />
    </>
  )
}

export default Main