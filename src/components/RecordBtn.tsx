import { useState, useRef } from "react";
import { transcribe } from "../apis/transcribe";
import { Loading, StartRecord, StopRecord } from "./recordStatus";

interface MyWindow extends Window {
  transcriptionNotSupportedModal: {
    showModal: () => void;
  };
}

const RecordBtn = (props: {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  disabled: boolean;
  className?: string;
}) => {
  const [recordStatus, setRecordStatus] = useState(0); // 0-start, 1-stop, 2-loading
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const audioChunks = useRef<Blob[]>([]);

  const transcribeRecord = async (formData: FormData) => {
    try {
      const data = JSON.parse(await transcribe({ formData }));
      data.transcription && props.setInputValue(data.transcription);
      setRecordStatus(0);
    } catch (err: any) {
      console.error(err);
      setRecordStatus(0); // failed!
    }
  };

  const handleStartRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const newMediaRecorder = new MediaRecorder(stream);
      setMediaRecorder(newMediaRecorder);

      newMediaRecorder.start();
      setRecordStatus(1);

      newMediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      newMediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const audioFile = new Blob([audioBlob], { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio_chunk", audioFile, "recording.webm");
        transcribeRecord(formData);
        audioChunks.current = [];
      };
    });
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      setRecordStatus(2);
      mediaRecorder.stop();
    }
  };

  function isSupportedBrowser() {
    const userAgent = navigator.userAgent;

    // Check for Chrome
    const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent);

    // Check for Edge (includes both old EdgeHTML and Chromium-based versions)
    const isEdge = /Edg/.test(userAgent);

    return isChrome || isEdge;
  }

  const handleRecord = () => {
    if (isSupportedBrowser()) {
      switch (recordStatus) {
        case 0: // start
          handleStartRecording();
          break;
        case 1:
          handleStopRecording();
          break;
        case 2:
          break;
        default:
          break;
      }
    } else {
      (
        window as unknown as MyWindow
      ).transcriptionNotSupportedModal.showModal();
    }
  };

  return (
    <div>
      <button
        className={`btn ${props.className}`}
        onClick={() => {
          handleRecord();
        }}
        disabled={recordStatus === 2 || props.disabled}
      >
        {recordStatus === 0 ? (
          <StartRecord />
        ) : recordStatus === 1 ? (
          <StopRecord />
        ) : (
          <Loading />
        )}
      </button>
    </div>
  );
};

export default RecordBtn;
