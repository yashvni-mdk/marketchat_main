import * as React from 'react';
export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function reset(name, params) {
  if (navigationRef.current) {
    return navigationRef?.current?.reset({
      index: 0,
      routes: [
        {
          name,
          params,
        },
      ],
    });
  }
  return null;
}
