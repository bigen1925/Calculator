import exp from "constants";
import { useState } from "react";
import { isExpressionStatement } from "typescript";
import "./App.css";

type Operation = (a: number, b: number) => number;
type Expression = [Expression, Operation, number] | number;
type Inputs = [ex: Expression, op?: Operation];

function App() {
  const [inputs, setInputs] = useState<Inputs>([0]);

  let display: number;
  if (!inputs[1]) {
    // 最終入力が数字の場合は、入力中の数字を表示する
    const expression = inputs[0];
    display = typeof expression === "number" ? expression : expression[2];
  } else {
    // 最終入力がオペレーションの場合は、これまでの計算を評価して表示する
    display = evaluate(inputs[0]);
  }

  function onClickNumber(number: number) {
    if (inputs[1]) {
      return setInputs([[inputs[0], inputs[1], number]]);
    }

    const expression = inputs[0];
    if (typeof expression === "number") {
      return setInputs([expression * 10 + number]);
    }

    setInputs([[expression[0], expression[1], expression[2] * 10 + number]]);
  }

  function onClickOperation(operation: Operation) {
    setInputs([inputs[0], operation]);
  }

  function onClickClear() {
    if (inputs[1]) {
      return setInputs([inputs[0]]);
    }

    const expression = inputs[0];
    if (typeof expression === "number") {
      return setInputs([0]);
    }

    setInputs([expression[0], expression[1]]);
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
            {-1e8 <= display && display <= 1e8 ? display : "ERR"}
          </td>
        </tr>
        <tr>
          <td>
            <Pad symbol="C" onClick={() => onClickClear()} />
          </td>
          <td>
            <Pad symbol="AC" onClick={() => setInputs([0])} />
          </td>
          <td />
          <td>{createOperationPad("+", (a, b) => a + b)}</td>
        </tr>
        <tr>
          <td>{createNumberPad(7)}</td>
          <td>{createNumberPad(8)}</td>
          <td>{createNumberPad(9)}</td>
          <td>{createOperationPad("-", (a, b) => a - b)}</td>
        </tr>
        <tr>
          <td>{createNumberPad(4)}</td>
          <td>{createNumberPad(5)}</td>
          <td>{createNumberPad(6)}</td>
          <td>{createOperationPad("*", (a, b) => a * b)}</td>
        </tr>
        <tr>
          <td>{createNumberPad(1)}</td>
          <td>{createNumberPad(2)}</td>
          <td>{createNumberPad(3)}</td>
          {/* 簡単のため、小数点以下は切り捨てることにする */}
          <td>{createOperationPad("/", (a, b) => Math.floor(a / b))}</td>
        </tr>
        <tr>
          <td colSpan={3}>{createNumberPad(0)}</td>
          <td>{createOperationPad("=", (_, b) => b)}</td>
        </tr>
      </tbody>
    </table>
  );
}

function evaluate(expression: Expression): number {
  if (typeof expression === "number") {
    return expression;
  }

  const exp = expression[0];
  const operation = expression[1];
  const num = expression[2];

  return operation(evaluate(expression[0]), num);
}

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
