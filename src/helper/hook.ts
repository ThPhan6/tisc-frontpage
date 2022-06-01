import React from 'react';

export function useDefault(defaultValue: any) {
  const [value, setValue] = React.useState(defaultValue);
  return { value, setValue };
}

export function useBoolean(defaultValue = false) {
  return useDefault(defaultValue);
}

export function useNumber(defaultValue = 0) {
  return useDefault(defaultValue);
}

export function useString(defaultValue = '') {
  return useDefault(defaultValue);
}
