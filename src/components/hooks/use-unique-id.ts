import { useRef } from 'react';

import createUID from '@/utils/create-uid';

import uniqueId from 'lodash/uniqueId';

export default function useUniqueId(prefix = '', len = 10) {
  const idRef = useRef<string>(null);

  if (!idRef.current) {
    idRef.current = `${uniqueId(prefix)}-${createUID(len)}`;
  }

  return idRef.current;
}
