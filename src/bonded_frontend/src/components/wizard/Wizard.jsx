import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import style from "./scss/_wizard.module.scss";
import logo2 from "@/assets/logo/logo2.png";

const Wizard = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getCurrentStep = () => {
        const path = location.pathname;
        if (path === '/wizard') return 0;
        // if (path === '/wizard/email') return 1;
        // if (path === '/wizard/password') return ;
        if (path === '/wizard/passport') return 1
        if (path === '/wizard/profile-photo') return 2;
        if (path === '/wizard/nationalities') return 3;
        if (path === '/wizard/residencies') return 4;
        if (path === '/wizard/upload-file') return 5;
        if (path === '/wizard/complete-profile') return 6;
        if (path === '/wizard/kyc') return 7;
        if (path === '/wizard/bond-invitation') return 8;
        if (path === '/wizard/bond-confirmation') return 9;
        if (path === '/wizard/bond-pending') return 10;
        if (path === '/wizard/partner-confirmation') return 11;
        if (path === '/wizard/partner-pending') return 12;
        if (path === '/wizard/integration') return 13;
        if (path === '/wizard/integration-message') return 14;
        if (path === '/wizard/integration-email') return 15;
        if (path === '/wizard/integration-media') return 16;
        if (path === '/wizard/integration-video-calls') return 17;
        if (path === '/wizard/integration-calendar') return 18;
        if (path === '/wizard/integration-photo') return 19;
        if (path === '/wizard/integration-location') return 20;
        if (path === '/wizard/integration-complete') return 21;
        if (path === '/wizard/integration-confirmation') return 22;
        if (path === '/wizard/integration-pending') return 23;
        if (path === '/wizard/payment') return 24;
        if (path === '/wizard/payment-pending') return 25;
        if (path === '/wizard/payment-comfirmation') return 26;
        if (path === '/wizard/complete') return 27;
        return 0;
    };

    const currentStep = getCurrentStep();
    const total = 27;
    const pct = ((currentStep + 1) / total) * 100;

    return (
        <div className={style.container}>
            <div className={style.header}>

                <img
                    src={logo2}
                    alt="logo"
                    loading="eager"
                    className={style.logo}
                    onClick={() => navigate('/login')}
                    role="link"
                />

                <div className={style.progress} style={{ ["--pct"]: `${pct}%` }}>
                    <div className={style.bar} />
                </div>
            </div>

            <div className={style.content}>
                <Outlet />
            </div>
        </div>
    );
};

export default Wizard;
