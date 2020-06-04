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

      MicroblinkSDK.SetAuthorization(token);
      MicroblinkSDK.SetRecognizers(recognizers);

      uiComponent.current?.addEventListener('resultReady', resultReady, false);
      uiComponent.current?.addEventListener('error', onError, false);
    },
    [uiComponent, resultReady, onError, recognizers, token]
  );

  return (
    <div style={{height: '220px'}}>
      <microblink-ui-web ref={uiComponent}></microblink-ui-web>
    </div>

  )
}