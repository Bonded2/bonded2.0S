import React, { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./scss/_dots.module.scss";

const DotsWizard = memo(function DotsWizard({
    classes = {},
    routes,
    onNavigate,
    ariaLabel = "Profile progress",
}) {
    const location = useLocation();
    const navigate = useNavigate();

    const substeps = routes ?? [
        { path: "/wizard/profile-photo", label: "Add a profile photo" },
        { path: "/wizard/nationalities", label: "Add nationalities" },
        { path: "/wizard/residencies", label: "Add residencies" },
        { path: "/wizard/upload-file", label: "Upload your files" },
    ];

    const substeps2 = routes ?? [
        { path: "/wizard/integration-message", label: "Direct messaging" },
        { path: "/wizard/integration-email", label: "Emails" },
        { path: "/wizard/integration-media", label: "Social media" },
        { path: "/wizard/integration-video-calls", label: "Video calls" },
        { path: "/wizard/integration-calendar", label: "Calendar" },
        { path: "/wizard/integration-photo", label: "Photo library" },
        { path: "/wizard/integration-location", label: "Photo library" },
    ]

    const isIntegrationPath =
        location.pathname.startsWith("/wizard/integration") ||
        substeps2.some(s => s.path === location.pathname);

    const stepsToRender = isIntegrationPath ? substeps2 : substeps;

    const activeIndex = Math.max(
        0,
        stepsToRender.findIndex(s => s.path === location.pathname)
    );

    // ANCHOR: Use default styles from SCSS module, allow custom classes to override
    const dotsClass = classes.dots || styles.dots;
    const dotClass = classes.dot || styles.dot;
    const activeClass = classes.active || styles.active;

    const go = (p) => {
        if (onNavigate) onNavigate(p);
        else navigate(p);
    };

    return (
        <div className={dotsClass} role="tablist" aria-label={ariaLabel}>
            {stepsToRender.map((s, i) => (
                <button
                    key={s.path}
                    type="button"
                    aria-label={s.label}
                    aria-current={i === activeIndex ? "step" : undefined}
                    className={`${dotClass} ${i === activeIndex ? activeClass : ""}`}
                    onClick={() => go(s.path)}
                />
            ))}
        </div>
    );
});

export default DotsWizard;
