import { useCallback, useEffect, useRef, useState } from 'react';
import { copyText, toast } from '../lib/utils';

export function useCopy(timeout = 1800) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string, message = 'Copied to clipboard') => {
      const ok = await copyText(text);
      toast(ok ? message : 'Could not copy — please copy it manually');
      if (ok) {
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), timeout);
      }
      return ok;
    },
    [timeout],
  );

  return { copied, copy };
}
