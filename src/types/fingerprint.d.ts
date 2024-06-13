declare namespace Fingerprint {
  interface SampleFormat {
    PngImage: string;
    Raw: string;
    Compressed: string;
    Intermediate: string;
  }

  interface QualityCode {
    [key: number]: string;
  }

  class WebApi {
    onDeviceConnected: (event: Event) => void;
    onDeviceDisconnected: (event: Event) => void;
    onCommunicationFailed: (event: Event) => void;
    onSamplesAcquired: (samples: any) => void;
    onQualityReported: (quality: any) => void;

    startAcquisition: (format: SampleFormat, readerId: string) => Promise<void>;
    stopAcquisition: () => Promise<void>;
    enumerateDevices: () => Promise<string[]>;
    getDeviceInfo: (uid: string) => Promise<any>;
  }

  function b64UrlTo64(input: string): string;
  function b64UrlToUtf8(input: string): string;
}
