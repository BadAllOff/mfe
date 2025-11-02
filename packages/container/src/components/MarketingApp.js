import React, { useRef, useEffect } from 'react';
import { mount } from 'marketing/MarketingApp';
import { useHistory } from 'react-router-dom';

export default function MarketingApp() {
  const marketingRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    if (marketingRef.current) {
      const cb = mount(marketingRef.current, {
        onNavigate: ({ pathname: nextPathname }) => {
          const { pathname } = history.location;

          if (pathname !== nextPathname) {
            history.push(nextPathname);
          }
        }
      });


      if (cb && cb.onParentNavigate) {
        history.listen(cb.onParentNavigate);
      }
    };

    return () => {
      if (marketingRef.current) {
        marketingRef.current.unmount();
      }
    };
  }, []);

  return <div ref={marketingRef} />;
}