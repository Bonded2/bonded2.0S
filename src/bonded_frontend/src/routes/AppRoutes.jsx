import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import PulseLoader from "@/loader/PulseLoader";
import {
  Main,
  LandingPage,
  OnboardPage,
  LoginPage,
  WizardPage,
  SignUp,
  EmailStep,
  CreatePassword,
  Passport,
  ProfilePhoto,
  Nationalities,
  Residencies,
  UploadFile,
  CompleteProfile,
  Kyc,
  BondInvitation,
  BondConfirmation,
  BondPending,
  PartnerConfirmation,
  PartnerPending,
  Integration,
  IntegrationMessage,
  IntegrationEmail,
  IntegrationMedia,
  IntegrationVideoCalls,
  IntegrationCalendar,
  IntegrationPhoto,
  IntegrationLocation,
  IntegrationComplete,
  IntegrationConfirmation,
  IntegrationPending,
  Payment,
  PaymentPending,
  PaymentComfirmation,
  Complete,
  BacktoLogIn,
  DashboardPage,
  DashboardMain,
  Timeline,
  OpenChat,
  Notification,
  Export,
  Photo,
  DirectMessage,
  DirectMessageSelection,
  Email,
  Media,
  Calendar,
  VideoCalls,
  PhotoSelection,
  InvitationEmail,
  ProfileInformation,
  Setting,
} from "./LazyCodeSplitting";
// import { SessionProvider } from "./SessionProvider"
// import AccessProvider from "./AccessProvider";

const AppRoutes = () => {

  return (
    <BrowserRouter>
      {/* <SessionProvider>
        <AccessProvider> */}
          <Suspense fallback={<PulseLoader size={24} color="var(--secondary-color)" />}>
            <Routes>
              <Route element={<Main />}>
                <Route index element={<LandingPage />} />
                <Route path="/onboard" element={<OnboardPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/backtologin" element={<BacktoLogIn />} />
                <Route path="/invitationemail" element={<InvitationEmail />} />

                {/* ANCHOR: Wizard Step */}
                <Route path="/wizard" element={<WizardPage />}>

                  {/* Signup Routes */}
                  <Route index element={<SignUp />} />
                  <Route path="email" element={<EmailStep />} />
                  <Route path="password" element={<CreatePassword />} />
                  <Route path="passport" element={<Passport />} />
                  <Route path="profile-photo" element={<ProfilePhoto />} />
                  <Route path="nationalities" element={<Nationalities />} />
                  <Route path="residencies" element={<Residencies />} />
                  <Route path="upload-file" element={<UploadFile />} />
                  <Route path="complete-profile" element={<CompleteProfile />} />
                  <Route path="kyc" element={<Kyc />} />
                  <Route path="bond-invitation" element={<BondInvitation />} />
                  <Route path="bond-confirmation" element={<BondConfirmation />} />
                  <Route path="bond-pending" element={<BondPending />} />
                  <Route path="partner-confirmation" element={<PartnerConfirmation />} />
                  <Route path="partner-pending" element={<PartnerPending />} />

                  {/* Integration Routes */}
                  <Route path="integration" element={<Integration />} />
                  <Route path="integration-message" element={<IntegrationMessage />} />
                  <Route path="integration-email" element={<IntegrationEmail />} />
                  <Route path="integration-media" element={<IntegrationMedia />} />
                  <Route path="integration-video-calls" element={<IntegrationVideoCalls />} />
                  <Route path="integration-calendar" element={<IntegrationCalendar />} />
                  <Route path="integration-photo" element={<IntegrationPhoto />} />
                  <Route path="integration-location" element={<IntegrationLocation />} />
                  <Route path="integration-complete" element={<IntegrationComplete />} />
                  <Route path="integration-pending" element={<IntegrationPending />} />
                  <Route path="integration-confirmation" element={<IntegrationConfirmation />} />

                  {/* Payment Routes */}
                  <Route path="payment" element={<Payment />} />
                  <Route path="payment-pending" element={<PaymentPending />} />
                  <Route path="payment-comfirmation" element={<PaymentComfirmation />} />

                  <Route path="complete" element={<Complete />} />
                </Route>

                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<DashboardPage />}>
                  <Route index element={<DashboardMain />} />
                  <Route path="timeline" element={<Timeline />} />
                  <Route path="open-chat" element={<OpenChat />} />
                  <Route path="notification" element={<Notification />} />
                  <Route path="export" element={<Export />} />
                  <Route path="photo" element={<Photo />} />
                  <Route path="message" element={<DirectMessage />} />
                  <Route path="direct-message-selection" element={<DirectMessageSelection />} />
                  <Route path="email" element={<Email />} />
                  <Route path="media" element={<Media />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="video-calls" element={<VideoCalls />} />
                  <Route path="photo-selection" element={<PhotoSelection />} />
                  <Route path="profile-information" element={<ProfileInformation />} />
                  <Route path="settings" element={<Setting />} />
                </Route>

              </Route>

            </Routes>
          </Suspense>
        {/* </AccessProvider>
      </SessionProvider> */}
    </BrowserRouter>
  )
}

export default AppRoutes