import React, { useRef, useEffect } from 'react';
import { mount } from 'marketing/MarketingApp';
import { useHistory } from 'react-router-dom';

export default function MarketingApp() {
    const marketingRef = useRef(null);
    const history = useHistory();
    let onParentNav = null;
    
    useEffect(() => {
        // if (marketingRef.current) {
        onParentNav = mount(marketingRef.current, {
            onNavigate: ({ pathname: nextPathname }) => {
                const { pathname } = history.location;

                if (pathname !== nextPathname) {
                    history.push(nextPathname);
                }
            }
        });
        
        if (onParentNav.onParentNavigate) {
            history.listen(onParentNav.onParentNavigate);
        } else {
            console.error('onParentNavigate is not a function');
        }
        // }
        return () => {
            if (marketingRef.current) {
                marketingRef.current.unmount();
            }
        };
    }, [onParentNav]);

    return <div ref={marketingRef} />;
}