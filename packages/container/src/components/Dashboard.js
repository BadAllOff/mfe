import { mount } from 'dashboard/DashboardApp';
import React, { useRef, useEffect } from 'react';

export default function DashboardApp() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      mount(ref.current);
    };

    return () => {
      if (ref.current) {
        ref.current.unmount();
      }
    };
  }, []);

  return <div ref={ref} />;
}