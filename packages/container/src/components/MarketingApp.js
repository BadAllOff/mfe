import { mount } from 'marketing/MarketingApp';
import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function MarketingApp() {
  const marketingRef = useRef(null);
  const history = useHistory();
  let cb = null;

  useEffect(() => {
    if (marketingRef.current) {
      cb = mount(marketingRef.current, {
        onNavigate: ({ pathname: nextPathname }) => {
          const { pathname } = history.location;

          if (pathname !== nextPathname) {
            history.push(nextPathname);
          }
        }
      });


      if (cb && cb.onParentNavigate) {
        history.listen(cb.onParentNavigate);
      }else {
        console.error('onParentNavigate is not a function');
      }
    };

    return () => {
      if (marketingRef.current) {
        marketingRef.current.unmount();
      }
    };
  }, [cb]);

  return <div ref={marketingRef} />;
}