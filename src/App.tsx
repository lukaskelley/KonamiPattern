import { useEffect, useState, useCallback, useRef } from "react";
import Header from "./components/Header";
import Home from "./components/Home";
import { SecretDataType } from "./secretDataType";

function App() {
  const secretText = "inject"; // Secret Key
  const keyTime = 5000; //Typing duration
  const showDataTime = 15000; //ShowData

  const intervalRef: { current: NodeJS.Timeout | null } = useRef(null);
  const keyPress = useRef<string>("");
  const startSecretType = useRef<boolean>(false);
  const [typingText, setTypingText] = useState<string>("");
  const [showSecretDataState, setShowSecretDataState] =
    useState<boolean>(false);
  const [showData, setShowData] = useState<Array<SecretDataType>>([]);

  // Initialized to first state
  const resetAll = () => {
    setTypingText("");
    startSecretType.current = false;
  };

  // Key press event
  const handleKeyPress = useCallback(
    (keyEvent: any) => {
      const { key, keyCode } = keyEvent;
      keyPress.current = key;
      if (keyCode === 27) {
        resetAll();
      } else if (keyCode === 73) {
        startSecretType.current = true;
        setTypingText(key);
        intervalRef.current && clearTimer();
        startKeyTimer();
      }

      if (startSecretType.current) {
        intervalRef.current && clearTimer();
        if (typingText.length > secretText.length) {
          resetAll();
        }
        setTypingText(typingText + key);
        startKeyTimer();
      }
    },
    [keyPress.current]
  );

  const startKeyTimer = () => {
    const keyTimer = setTimeout(() => {
      resetAll();
      clearTimer();
    }, keyTime);
    intervalRef.current = keyTimer;
  };

  const clearTimer = () => {
    clearTimeout(intervalRef.current as NodeJS.Timeout);
  };

  // Get pressed key
  useEffect(() => {
    if (typingText === secretText) {
      setShowSecretDataState(!showSecretDataState);
      resetAll();
    }

    window.addEventListener("keydown", handleKeyPress);
  }, [handleKeyPress, typingText]);

  // Get newest 5 secret konami data
  const pushSecretData = (data: Array<SecretDataType>) => {
    let showDataArray: Array<SecretDataType> = [];
    for (let i = 0; i < 5; i++) {
      showDataArray.push({
        title: data[i].title,
        user: {
          login: data[i].user.login,
        },
      });
    }
    setShowData(showDataArray);
  };

  // Get all konami data & show data
  useEffect(() => {
    if (showSecretDataState) {
      const showTimer = setTimeout(() => {
        setShowSecretDataState((prevState) => (prevState = !prevState));
        setShowData([]);
      }, showDataTime);
      (async () => {
        await fetch("https://api.github.com/repos/elixir-lang/elixir/issues")
          .then((res) => {
            Promise.any([res.json()]).then((data) => {
              pushSecretData(data);
            });
          })
          .catch((err) => {
            throw err;
          });
      })();
      return () => {
        clearTimeout(showTimer);
      };
    }
  }, [showSecretDataState]);

  return (
    <div className="App">
      <Header />
      {showSecretDataState && <Home showSecretData={showData} />}
    </div>
  );
}

export default App;
