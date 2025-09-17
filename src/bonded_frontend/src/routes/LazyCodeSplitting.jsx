import { lazy } from 'react'

// ANCHOR: Layout (Main wrapper)
export const Main = lazy(() =>
    import("@/pages/Main")
);

export const LandingPage = lazy(() =>
    import("@/pages/LandingPage")
);

export const OnboardPage = lazy(() =>
    import("@/pages/OnBoardPage")
);

export const LoginPage = lazy(() =>
    import("@/pages/LoginPage")
);

export const InvitationEmail = lazy(() =>
    import("@/components/email/InvitationEmail")
);


// Signup Page

export const WizardPage = lazy(() =>
    import("@/pages/WizardPage")
);

export const SignUp = lazy(() =>
    import("@/components/auth/signup/SignUp")
);

export const EmailStep = lazy(() =>
    import("@/components/auth/signup/Email")
);

export const CreatePassword = lazy(() =>
    import("@/components/auth/signup/CreatePassword")
);

export const Passport = lazy(() =>
    import("@/components/auth/profile/Passport")
);

export const ProfilePhoto = lazy(() =>
    import("@/components/auth/profile/ProfilePhoto")
);

export const Nationalities = lazy(() =>
    import("@/components/auth/profile/Nationalities")
);

export const Residencies = lazy(() =>
    import("@/components/auth/profile/Residencies")
);

export const UploadFile = lazy(() =>
    import("@/components/auth/profile/UploadFile")
);

export const CompleteProfile = lazy(() =>
    import("@/components/auth/profile/CompleteProfile")
);

export const Kyc = lazy(() =>
    import("@/components/auth/kyc/Kyc")
);

export const BondInvitation = lazy(() =>
    import("@/components/auth/invatation/BondInvitation")
);

export const BondConfirmation = lazy(() =>
    import("@/components/auth/invatation/BondConfirmation")
);

export const BondPending = lazy(() =>
    import("@/components/auth/invatation/BondPending")
);

export const PartnerConfirmation = lazy(() =>
    import("@/components/auth/invatation/PartnerConfirmation")
);

export const PartnerPending = lazy(() =>
    import("@/components/auth/invatation/PartnerPending")
);

export const Integration = lazy(() =>
    import("@/components/auth/integration/Integrartion")
);

export const IntegrationMessage = lazy(() =>
    import("@/components/auth/integration/IntegrartionMessage")
);

export const IntegrationEmail = lazy(() =>  
    import("@/components/auth/integration/IntegrartionEmail")
);

export const IntegrationMedia = lazy(() =>
    import("@/components/auth/integration/IntegrartionMedia")
);

export const IntegrationVideoCalls = lazy(() =>
    import("@/components/auth/integration/IntegrartionVideoCalls")
);

export const IntegrationCalendar = lazy(() =>
    import("@/components/auth/integration/IntegrartionCalendar")
);

export const IntegrationPhoto = lazy(() =>
    import("@/components/auth/integration/IntegrartionPhoto")
);

export const IntegrationLocation = lazy(() =>
    import("@/components/auth/integration/IntegrartionLocation")
);

export const IntegrationComplete = lazy(() =>
    import("@/components/auth/integration/IntegrartionComplete")
);

export const IntegrationConfirmation = lazy(() =>
    import("@/components/auth/invatation/IntegrationConfirmation")
);

export const IntegrationPending = lazy(() =>
    import("@/components/auth/invatation/IntegrationPending")
);

export const Payment = lazy(() =>
    import("@/components/auth/payment/Payment")
);

export const PaymentPending = lazy(() =>
    import("@/components/auth/invatation/PaymentPending")
);

export const PaymentComfirmation = lazy(() =>
    import("@/components/auth/invatation/PaymentComfirmation")
);

export const Complete = lazy(() =>
    import("@/components/auth/invatation/Complete")
);

export const BacktoLogIn = lazy(() =>
    import("@/components/welcome/BacktoLogIn")
);




// Dashboard

export const DashboardPage = lazy(() =>
    import("@/pages/DashboardPage")
);

export const DashboardMain = lazy(() =>
    import("@/components/dashboard/Dashboard")
);

export const Timeline = lazy(() =>
    import("@/components/dashboard/Timeline")
);

export const OpenChat = lazy(() =>
    import("@/components/dashboard/OpenChat")
);

export const Notification = lazy(() =>
    import("@/components/dashboard/Notification")
);

export const Export = lazy(() =>
    import("@/components/dashboard/Export")
);

export const Photo = lazy(() =>
    import("@/components/dashboard/gallery/Photo")
);

export const DirectMessage = lazy(() =>
    import("@/components/dashboard/direct-message/DirectMessage")
);

export const DirectMessageSelection = lazy(() =>
    import("@/components/dashboard/direct-message/DirectMessageSelection")
);

export const Email = lazy(() =>
    import("@/components/dashboard/email/Email")
);

export const Media = lazy(() =>
    import("@/components/dashboard/social-media/Media")
);

export const Calendar = lazy(() =>
    import("@/components/dashboard/calendar/Calendar")
);

export const VideoCalls = lazy(() =>
    import("@/components/dashboard/video-calls/VideoCalls")
);

export const PhotoSelection = lazy(() =>
    import("@/components/dashboard/gallery/PhotoSelection")
);

export const ProfileInformation = lazy(() =>
    import("@/components/dashboard/profile/ProfileInformation")
);

export const Setting = lazy(() =>
    import("@/components/dashboard/settings/Setting")
);















