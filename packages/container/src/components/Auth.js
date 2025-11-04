import { mount } from 'auth/AuthApp';
import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function AuthApp() {
  const ref = useRef(null);
  const history = useHistory();
  let cb = null;

  useEffect(() => {
    if (ref.current) {
      cb = mount(ref.current, {
        initialPath: history.location.pathname,
        onNavigate: ({ pathname: nextPathname }) => {
          const { pathname } = history.location;

          if (pathname !== nextPathname) {
            history.push(nextPathname);
          }
        },
      });


      if (cb && cb.onParentNavigate) {
        history.listen(cb.onParentNavigate);
      }else {
        console.error('onParentNavigate is not a function');
      }
    };

    return () => {
      if (ref.current) {
        ref.current.unmount();
      }
    };
  }, [cb]);

  return <div ref={ref} />;
}