import React, { useRef, useEffect } from 'react';
import { mount } from 'marketing/MarketingApp';

export default function MarketingApp() {
    const marketingRef = useRef(null);

    useEffect(() => {
        if (marketingRef.current) {
            mount(marketingRef.current);
        }
        return () => {
            if (marketingRef.current) {
                marketingRef.current.unmount();
            }
        };
    }, []);

    return <div ref={marketingRef} />;
}