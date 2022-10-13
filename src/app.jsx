// import { Counter } from "./components/counter"
// import Counter from "./components/counter"
// import { User } from "./components/user"

// import Router from "./router";

// export function App() {
//     return (
//         <Router />
//     )
// }

import React, { useRef } from "react";
import {
  KeepaliveItem,
  KeepaliveScope,
  useCacheDestroy
} from "./components/keepaliveCopy";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";
import { useThrottle } from "./utils/hooks.ts";


const CompForm = (props)=> {
  const [value, setValue] = React.useState("");
  const handleClick = useThrottle(()=>{console.log('---');}, 1000)
  return <div>
    <p>this is a form component</p>
    input content：{" "}
    <input value={value} onChange={(e) => setValue(e.target.value)} />
    <button onClick={handleClick}>test</button>
  </div>;
}

function Atom({ propsNumber }) {
  const [number, setNumber] = React.useState(0);
  return (
    <div>
      propsNumber:{propsNumber} | current:{number}
      <button onClick={() => setNumber(number + 1)}>add++</button>
      <button onClick={() => setNumber(number - 1)}>del--</button>
    </div>
  );
}

function CompNumber() {
  const [number, setNumber] = React.useState(0);
  const [isShow, setShow] = React.useState(true);
  return (
    <div>
      <p>this is a number component</p>
      {isShow && <Atom propsNumber={number} />}
      {isShow && (
         // 缓存 Atom 组件 
        <KeepaliveItem cacheId="number_atom">
          <Atom propsNumber={number} />
        </KeepaliveItem>
      )}
      <button onClick={() => setShow(!isShow)}>
        atom {isShow ? "hidden" : "show"}
      </button>
      <br />
      <button onClick={() => setNumber(number + 1)}>add</button>
    </div>
  );
}

function CompText() {
  const destroy = useCacheDestroy();
  return (
    <div>
      component c
      {/* 销毁 cacheId = form 的组件 */}
      <button onClick={() => destroy("number_atom")}>clean form cache</button>
    </div>
  );
}
/* 菜单栏组件 */
function Menus() {
  const navigate = useNavigate();
  return (
    <div>
      router:
      <button style={{ marginRight: "10px" }} onClick={() => navigate("/form")}>
        form
      </button>
      <button
        style={{ marginRight: "10px" }}
        onClick={() => navigate("/number")}
      >
        number
      </button>
      <button style={{ marginRight: "10px" }} onClick={() => navigate("/text")}>
        text
      </button>
    </div>
  );
}

export function App() {
  return (
    <Router>
      <Menus />
      <KeepaliveScope>
        <Routes>
          <Route
            element={
              // 缓存路由 /form
              <KeepaliveItem cacheId="form">
                <CompForm />
              </KeepaliveItem>
            }
            path="/form"
          />
          <Route element={<CompNumber />} path="/number" />
          <Route element={<CompText />} path="/text" />
        </Routes>
      </KeepaliveScope>
    </Router>
  );
}
