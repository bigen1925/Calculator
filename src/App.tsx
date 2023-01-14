import { useState } from "react";
import "./App.css";

function App() {
  const [inputs, setInputs] = useState<PadValue[]>([0]);
  const lastInput = inputs.at(-1);

  let display: number;
  if (typeof lastInput === "number") {
    // 最終入力が数字の場合は、入力中の数字を表示する
    display = lastInput;
  } else {
    // 最終入力がオペレーションの場合は、過去の計算結果を表示する
    if (typeof inputs[0] !== "number")
      throw Error("inputs are something wrong");

    // [number, operation, number, operation, ...]
    // と並んでいるはずなので、順番に operation(currentTotal, nextNumber) を計算していく
    let currentTotal = inputs[0];
    let pointer = 1;
    while (true) {
      const operation = inputs[pointer];
      const nextNumber = inputs[pointer + 1];
      if (!operation === undefined || nextNumber === undefined) {
        break;
      } else if (
        typeof operation !== "function" ||
        typeof nextNumber !== "number"
      ) {
        throw Error("inputs are something wrong");
      }

      currentTotal = operation(currentTotal, nextNumber);
      pointer += 2;
    }
    display = currentTotal;
  }

  function onClickNumber(number: number) {
    if (typeof lastInput === "number") {
      setInputs([...inputs.slice(0, -1), lastInput * 10 + number]);
    } else {
      setInputs([...inputs, number]);
    }
  }

  function onClickOperation(operation: Operation) {
    if (typeof lastInput === "number") {
      setInputs([...inputs, operation]);
    } else {
      setInputs([...inputs.slice(0, -1), operation]);
    }
  }

  function createNumberPad(number: number) {
    return <Pad value={number} onClick={onClickNumber} />;
  }

  function createOperationPad(symbol: string, operation: Operation) {
    return <Pad symbol={symbol} value={operation} onClick={onClickOperation} />;
  }

  return (
    <table border={1}>
      <tbody>
        <tr>
          <td colSpan={4} style={{ textAlign: "right" }}>
            {display}
          </td>
        </tr>
        <tr>
          <td>{createNumberPad(7)}</td>
          <td>{createNumberPad(8)}</td>
          <td>{createNumberPad(9)}</td>
          <td>{createOperationPad("+", (a, b) => a + b)}</td>
        </tr>
        <tr>
          <td>{createNumberPad(4)}</td>
          <td>{createNumberPad(5)}</td>
          <td>{createNumberPad(6)}</td>
          <td>{createOperationPad("-", (a, b) => a - b)}</td>
        </tr>
        <tr>
          <td>{createNumberPad(1)}</td>
          <td>{createNumberPad(2)}</td>
          <td>{createNumberPad(3)}</td>
          <td>{createOperationPad("=", (_, b) => b)}</td>
        </tr>
        <tr>
          <td colSpan={2}>{createNumberPad(0)}</td>
          <td>
            <Pad symbol="C" onClick={() => setInputs(inputs.slice(0, -1))} />
          </td>
          <td>
            <Pad symbol="AC" onClick={() => setInputs([0])} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

type Operation = (a: number, b: number) => number;
type PadValue = number | Operation;
type PadProps<T> =
  | {
      // value を受け取る場合は onClick は第一引数をとり、symbol は省略可能
      value: T;
      symbol?: string;
      onClick: (value: T) => void;
    }
  | {
      // value を受け取らない場合は onClick は引数をとらず、symbol は省略不可能
      symbol: string;
      onClick: () => void;
    };
function Pad<T>(props: PadProps<T>) {
  return "value" in props ? (
    <div
      style={{ cursor: "pointer" }}
      onClick={() => props.onClick(props.value)}
    >
      {props.symbol ?? String(props.value)}
    </div>
  ) : (
    <div style={{ cursor: "pointer" }} onClick={() => props.onClick()}>
      {props.symbol}
    </div>
  );
}

export default App;
