import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import MockWindow from "./components/MockWindow";
import ChatBox from "./components/ChatBox";
import { ChatItem } from "./components/ChatList";
import { useState, useRef } from "react";
import type {
  ActionComponent,
  AnswerResponse,
  SelectableComponent,
} from "./apis/chat";
import { getChat } from "./apis/chat";
import { SendRef } from "./components/ChatBox";
import { motion } from "framer-motion";

function App() {
  const [stage, setStage] = useState("");
  const [component, setComponent] = useState<ActionComponent | null>(null);
  const [components, setComponents] = useState<SelectableComponent[] | null>(
    null
  );
  const [screenDescription, setScreenDescription] = useState("");
  const [curContent, setCurContent] = useState<string | undefined>("");
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<ChatItem>>([]); // real data from database
  const [shownChatList, setShownChatList] = useState<Array<ChatItem>>([]); // shown data in the chatbox
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [actionValue, setActionValue] = useState<string>("");
  const [open, setOpen] = useState<"confirm" | "input" | "">("");
  const [isChatShown, setIsChatShown] = useState(true);
  const [isConfirmationEnabled, setIsConfirmationEnabled] = useState(true);
  const sendRef = useRef<SendRef>(null);

  const getChatHistory = async () => {
    try {
      return await getChat();
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const dataUpdate = (res: AnswerResponse) => {
    setStage(res.type);
    setScreenDescription(res.screenDescription || "");
    if (res.component !== undefined) {
      setComponent(res.component);
      if (res.components != undefined) {
        setComponents(res.components);
      }
    } else {
      console.error("No component(s) available!");
    }
    if (res.actionValue) setActionValue(res.actionValue);
    (async () => {
      setChatHistory(await getChatHistory());
      setIsProcessing(false);
    })();
  };

  return (
    <div className='flex flex-col h-screen max-h-[100vh]'>
      <NavBar
        stage={stage}
        className='flex-none'
        isChatShown={isChatShown}
        setIsChatShown={setIsChatShown}
        isConfirmationEnabled={isConfirmationEnabled}
        setIsConfirmationEnabled={setIsConfirmationEnabled}
      />
      <div
        className={`flex flex-row mx-4 my-4 ${
          isChatShown ? "space-x-4" : ""
        } flex-grow overflow-auto`}
      >
        <motion.div
          style={{
            width: isChatShown ? "fit-content" : "100%",
          }}
          className={`flex-1 h-full`}
        >
          <MockWindow
            className={`h-full ${
              isChatShown ? "w-[calc(50vw-1rem)]" : "w-full"
            }`}
            stage={stage}
            setStage={setStage}
            content={curContent}
            component={component}
            setComponent={setComponent}
            components={components}
            setComponents={setComponents}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            inputValue={inputValue}
            setInputValue={setInputValue}
            dataUpdate={dataUpdate}
            actionValue={actionValue}
            onSend={sendRef.current?.handleSend}
            handleKeyPress={sendRef.current?.handleKeyPress}
            open={open}
            setOpen={setOpen}
            isChatShown={isChatShown}
            isConfirmationEnabled={isConfirmationEnabled}
            setIsConfirmationEnabled={setIsConfirmationEnabled}
            screenDescription={screenDescription}
          />
        </motion.div>
        <motion.div
          layout
          style={{
            width: isChatShown ? "fit-content" : 0,
            visibility: isChatShown ? "initial" : "hidden",
            overflow: isChatShown ? "initial" : "hidden",
            flex: isChatShown ? "1" : "none",
          }}
          className={`h-full hidden lg:block`}
        >
          <ChatBox
            className={"flex-1 h-full"}
            stage={stage}
            setStage={setStage}
            component={component}
            setComponent={setComponent}
            components={components}
            setComponents={setComponents}
            setCurContent={setCurContent}
            dataUpdate={dataUpdate}
            inputValue={inputValue}
            setInputValue={setInputValue}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            shownChatList={shownChatList}
            setShownChatList={setShownChatList}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            actionValue={actionValue}
            setActionValue={setActionValue}
            getChatHistory={getChatHistory}
            ref={sendRef}
            setOpen={setOpen}
            setScreenDescription={setScreenDescription}
          />
        </motion.div>
      </div>
      <dialog id='transcriptionNotSupportedModal' className='modal'>
        <form method='dialog' className='modal-box'>
          <h3 className='font-bold text-lg'>Notice</h3>
          <p className='py-4'>
            Your browser is not supported for transcription. Please use Google
            Chrome or Microsoft Edge instead.
          </p>
          <div className='modal-action'>
            <button className='btn'>Close</button>
          </div>
        </form>
      </dialog>
      <Footer className='flex-none hidden lg:block' />
    </div>
  );
}

export default App;
