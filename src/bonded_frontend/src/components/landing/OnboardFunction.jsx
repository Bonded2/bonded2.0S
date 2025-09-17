import { useEffect, useState } from "react";
import Onboard1 from '@/assets/onboard/onboard1.png'
import Onboard2 from '@/assets/onboard/onboard2.png'
import Onboard3 from '@/assets/onboard/onboard3.png'

export const OnboardFunction = () => {
    const steps = [
        {
            title: "Relationship proof on autopilot",
            text: "Bonded is your Relationship Passport. It automatically collects and catalogues proof of your life as a couple, making evidence gathering for immigration free from the stress of keeping track.",
            backgroundColor: "#E2E9FF",
            image: Onboard1
        },
        {
            title: "Every stamp, beyond doubt",
            text: "Every stamp in your Relationship Passport, from holiday photos to legal documents and messages, is catalogued and time-stamped to create undeniable proof of your story.",
            backgroundColor: "#A4EAE3",
            image: Onboard2
        },
        {
            title: "Always yours, never ours",
            text: "Your Relationship Passport belongs only to you and your partner. Not even Bonded can access it. Every stamp is sealed with the highest privacy, and you're always in control.",
            backgroundColor: "#C0C4FF",
            image: Onboard3
        },
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        console.log(index);
    }, [index]);

    return {
        steps,
        index,
        setIndex,
        images: steps.map(step => step.image),
    }
}