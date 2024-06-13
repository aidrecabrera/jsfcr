// @ts-nocheck

import React, { useEffect, useState } from "react";

const FingerprintTest: React.FC = () => {
  const [state, setState] = useState<"reader" | "capture">("capture");
  const [quality, setQuality] = useState<string>("");
  const [readers, setReaders] = useState<string[]>([]);
  const [selectedReader, setSelectedReader] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [format, setFormat] = useState<Fingerprint.SampleFormat>(
    Fingerprint.SampleFormat.PngImage
  );
  const [acquisitionStarted, setAcquisitionStarted] = useState<boolean>(false);
  const [sdkTest, setSdkTest] = useState<FingerprintSdkTest | null>(null);

  useEffect(() => {
    const sdk = new FingerprintSdkTest();
    setSdkTest(sdk);
    sdk.enumerateDevices().then(setReaders);
  }, []);

  useEffect(() => {
    if (sdkTest) {
      sdkTest.onSamplesAcquired = (s: any) => sampleAcquired(s);
      sdkTest.onQualityReported = (e: { quality: string | number }) =>
        setQuality(Fingerprint.QualityCode[e.quality]);
    }
  }, [sdkTest]);

  const sampleAcquired = (s: any) => {
    if (format === Fingerprint.SampleFormat.PngImage) {
      const samples = JSON.parse(s.samples);
      const src = `data:image/png;base64,${Fingerprint.b64UrlTo64(samples[0])}`;
      setImageSrc(src);
    }
    // Handle other formats similarly
  };

  const handleStart = () => {
    if (sdkTest) {
      sdkTest
        .startCapture(format, selectedReader)
        .then(() => setAcquisitionStarted(true));
    }
  };

  const handleStop = () => {
    if (sdkTest) {
      sdkTest.stopCapture().then(() => setAcquisitionStarted(false));
    }
  };

  const handleSaveImage = () => {
    if (!imageSrc) return;
    const a = document.createElement("a");
    a.href = imageSrc;
    a.download = "sampleImage.png";
    a.click();
  };

  const handleSelectReader = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedReader(e.target.value);
  };

  return (
    <div className="container p-4 mx-auto">
      <nav className="text-white bg-blue-500 navbar">
        <div className="container-fluid">
          <div className="navbar-brand">Fingerprint WebAPI</div>
          <ul className="nav">
            <li className={`nav-item ${state === "reader" ? "active" : ""}`}>
              <a
                href="#"
                className="nav-link"
                onClick={() => setState("reader")}
              >
                Reader
              </a>
            </li>
            <li className={`nav-item ${state === "capture" ? "active" : ""}`}>
              <a
                href="#"
                className="nav-link"
                onClick={() => setState("capture")}
              >
                Capture
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {state === "capture" ? (
        <div>
          <div className="text-center text-red-500">{quality}</div>
          <div className="mx-auto border border-gray-400 w-96 h-96">
            {imageSrc && (
              <img src={imageSrc} alt="Fingerprint" className="w-full h-full" />
            )}
          </div>
          <div className="mt-4 text-center">
            <button
              className="mx-2 btn btn-primary"
              onClick={() => setImageSrc(null)}
            >
              Clear
            </button>
            <button className="mx-2 btn btn-primary" onClick={handleSaveImage}>
              Save
            </button>
            <button
              className="mx-2 btn btn-primary"
              onClick={handleStart}
              disabled={acquisitionStarted}
            >
              Start
            </button>
            <button
              className="mx-2 btn btn-primary"
              onClick={handleStop}
              disabled={!acquisitionStarted}
            >
              Stop
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h4>Select Reader :</h4>
          <select
            className="form-control"
            value={selectedReader}
            onChange={handleSelectReader}
          >
            <option value="">Select Reader</option>
            {readers.map((reader) => (
              <option key={reader} value={reader}>
                {reader}
              </option>
            ))}
          </select>
          <div className="mt-4 text-center">
            <button
              className="mx-2 btn btn-primary"
              onClick={() => sdkTest?.enumerateDevices().then(setReaders)}
            >
              Refresh List
            </button>
            <button className="mx-2 btn btn-primary">Capabilities</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FingerprintTest;
