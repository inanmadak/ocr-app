import 'microblink/dist/microblink.min';

import * as React from 'react';

const apiSecret = 'fb3dedd9-d831-4362-afe3-1ad6066e07c7';
const apiKey = '197d408f3ac34985a7fb7e7926c56f9d';
const token = `Bearer ${btoa(apiKey + ':' + apiSecret)}`;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'microblink-ui-web': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

// interface IMicroblinkUIProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
// //   resultReady: (event: Event) => void;
// //   error: (event: Event) => void;
// }

interface IScannerProps {
  onResultReady: (event: any) => void;
  onError: (event: Event) => void;
}

export interface CustomEvent extends Event{
  detail: {
    result: {
      code: string;
      data: any[];
    };
  }
}

export const Scanner: React.FC<IScannerProps> = ({ onResultReady, onError }) => {

  const uiComponent = React.useRef<HTMLElement | null>(null);

  const resultReady = React.useCallback((event: any) => {
    onResultReady(event?.detail.result)
  }, [onResultReady]);

  React.useEffect(() => {
    const MicroblinkSDK = (window as any).Microblink.SDK;

    MicroblinkSDK.SetAuthorization(token);
    MicroblinkSDK.SetRecognizers(['MRTD']);

    uiComponent.current?.addEventListener('resultReady', resultReady, false);
    uiComponent.current?.addEventListener('error', onError, false);
  },
  [uiComponent, resultReady, onError]);

  return (
    <div style={{height: '220px'}}>
      <microblink-ui-web ref={uiComponent}></microblink-ui-web>
    </div>

  )
}