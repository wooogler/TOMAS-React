import { Input } from 'antd';
import type { InputRef } from 'antd'
import { Loading } from './recordStatus';
import { useState, useRef } from 'react';
import { navigate } from '../apis/screen';

const MockWindow = (props: { className: string, html?: string, title?: string }) => {
    const [inputValue, setInputValue] = useState("")
    const [isDisabled, setIsDisabled] = useState(false)
    const inputRef = useRef<InputRef>(null);
    const suffix = <svg xmlns="http://www.w3.org/2000/svg" className="h-4" viewBox="0 0 512 512"><path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM281 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L136 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l182.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L393 239c9.4 9.4 9.4 24.6 0 33.9L281 385z"/></svg>

    const defaultHTML = `<body class="text-lg font-normal text-black bg-white">
    <h1 class="text-4xl font-bold">Bus Schedule from NY</h1>
    <table class="table-auto w-full mt-8">
      <thead>
        <tr>
          <th class="px-4 py-2 font-bold">Bus Company</th>
          <th class="px-4 py-2 font-bold">Departure Time</th>
          <th class="px-4 py-2 font-bold">Duration</th>
          <th class="px-4 py-2 font-bold">Arrival Time</th>
          <th class="px-4 py-2 font-bold">Departure Stop</th>
          <th class="px-4 py-2 font-bold">Arrival Stop</th>
          <th class="px-4 py-2 font-bold">Seats Available</th>
          <th class="px-4 py-2 font-bold">Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="border px-4 py-2">FlixBus</td>
          <td class="border px-4 py-2">1:20 pm</td>
          <td class="border px-4 py-2">6:10 hrs</td>
          <td class="border px-4 py-2">7:30 pm</td>
          <td class="border px-4 py-2">Downey (Stonewood Center)</td>
          <td class="border px-4 py-2">Las Vegas Strip (Las Vegas Blvd)</td>
          <td class="border px-4 py-2">Only 1 seat available!</td>
          <td class="border px-4 py-2">$88.99</td>
        </tr>
        <tr>
          <td class="border px-4 py-2">FlixBus</td>
          <td class="border px-4 py-2">1:20 pm</td>
          <td class="border px-4 py-2">6:35 hrs</td>
          <td class="border px-4 py-2">7:55 pm</td>
          <td class="border px-4 py-2">Downey (Stonewood Center)</td>
          <td class="border px-4 py-2">Downtown Las Vegas (1st St)</td>
          <td class="border px-4 py-2">Only 1 seat available!</td>
          <td class="border px-4 py-2">$88.99</td>
        </tr>
      </tbody>
    </table>
    <p class="mt-8">
      <a href="#" class="underline text-blue-600">Click here</a> for more information.
    </p>
  </body>
    `
  const handleKeyPress = (e: React.KeyboardEvent) => {
    switch (e.code) {
      case "Enter": onHandleGoTo(); break;
      default: break;
    }
  }

  const onHandleGoTo = () => {
    if (!inputValue) {
        console.log("Please input URL here!!!")
        return;
    }
    console.log(inputValue)
    setIsDisabled(true)
    // send url to backend
    try {
        navigate({ url: inputValue });
        console.log("Send url to backend...")
        setIsDisabled(false)
        inputRef.current && inputRef.current.blur()
      } catch (err) {
        console.error(err);
        return [];
      }
    // setTimeout(() => {
    //     console.log("Send url to backend...")
    //     setIsDisabled(false)
    //     inputRef.current && inputRef.current.blur()
    // }, 1000)
  }
//   let param = "https://shop.greyhound.com/checkout"

  return (
    <div className={`mockup-window border bg-base-300 relative ${props.className}`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 leading-[3rem] text-neutral-500">
        <Input
          placeholder="Input URL here."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyUp={(e) => handleKeyPress(e)}
          style={{ width: '25vw' }}
          suffix={<button onClick={() => onHandleGoTo()} disabled={isDisabled} className={"btn btn-link p-0 border-0 h-min min-h-min disabled:bg-transparent"}>{isDisabled ? <Loading className="h-min min-h-min" /> : suffix}</button>}
          disabled={isDisabled}
          ref={inputRef}
        />
      </div>
      {/* <iframe src="https://course.buct.edu.cn/" className="h-[calc(100%-1.75rem)] w-[100%] bg-base-200 overflow-y-auto"/> */}
      {/* <object data={param} className="h-[calc(100%-1.75rem)] w-[100%] bg-base-200 overflow-y-auto"/> */}
      <div
        dangerouslySetInnerHTML={{ __html: props.html && typeof(props.html) === "string" ? props.html : defaultHTML }}
        className="h-[calc(100%-1.75rem)] bg-base-200 overflow-y-auto py-4 px-8"
      />
    </div>
  )
}

export default MockWindow;