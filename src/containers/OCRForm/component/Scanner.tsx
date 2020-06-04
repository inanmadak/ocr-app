import * as React from 'react';

interface IScannerProps {
  onResultReady: (event: any) => void;
  onError: (event: Event) => void;
  recognizers: string[];
  token: string;
}

export const Scanner: React.FC<IScannerProps> = ({ onResultReady, onError, recognizers, token }) => {

  const uiComponent = React.useRef<HTMLElement | null>(null);

  const resultReady = React.useCallback((event: any) => {
    onResultReady(event?.detail.result)
  }, [onResultReady]);

  React.useEffect(
    () => {
      const MicroblinkSDK = window.Microblink.SDK;
      const el = uiComponent.current;

      MicroblinkSDK.SetAuthorization(token);
      MicroblinkSDK.SetRecognizers(recognizers);

      el?.addEventListener('resultReady', resultReady, false);
      el?.addEventListener('error', onError, false);

      return () => {
        el?.removeEventListener('resultReady', resultReady);
        el?.removeEventListener('error', onError);
      }
    },
    [uiComponent, resultReady, onError, recognizers, token]
  );

  return (
    <div style={{height: '220px'}}>
      <microblink-ui-web ref={uiComponent}></microblink-ui-web>
    </div>

  )
}