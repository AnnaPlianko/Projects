import { useEffect, useState } from "react";
import "./Header.css";

export function Header() {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const onScroll = () => setOffset(window.scrollY);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className="scroll-header"
            style={{ backgroundPositionY: offset * 0.4 }}
        >
            <div
                className="scroll-content"
                style={{ transform: `translateY(${offset * -0.15}px)` }}
            >
                <h1>CRYPTONITE</h1>
                <p>Track. Analyze. Predict.</p>
            </div>
        </header>
    );
}
