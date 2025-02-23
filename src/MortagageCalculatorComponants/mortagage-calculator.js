import React, { useRef, useState } from 'react';
import "./../styles/MortagageCalculatorStyle.css";
import YourResult from "./your-result";

const MortagageCalculator = () => {
  // ===== Refs =====
  // Input field refs
  const [refInput1, refInput2, refInput3] = [useRef(null), useRef(null), useRef(null)];
  
  // Button refs for currency/unit indicators
  const [refButton1, refButton2, refButton3] = [useRef(null), useRef(null), useRef(null)];
  
  // Radio button container and input refs
  const [choiceContainer1, choiceContainer2] = [useRef(null), useRef(null)];
  const [choiceInput1, choiceInput2] = [useRef(null), useRef(null)];

  // ===== State Management =====
  // Form input values (for controlled components)
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [inputValue3, setInputValue3] = useState("");

  // Values passed to results component
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [choice, setChoice] = useState(0);

  // UI States
  const [focusState, setFocusState] = useState([false, false, false]); 
  const [errorState, setErrorState] = useState([false, false, false]);
  
  // Default styling
  const defaultErrorStyle = { color: "red", display: "none" };
  const [errorStyle, setErrorStyle] = useState(Array(4).fill(defaultErrorStyle));
  const [paddingInputStyle, setPaddingInputStyle] = useState([{}, {}]);

  // ===== State Update Helpers =====
  const updateState = (stateSetter) => (index, value) => {
    stateSetter(prev => {
      const newState = [...prev];
      newState[index] = value;
      return newState;
    });
  };

  const updateFocusState = updateState(setFocusState);
  const updateErrorState = updateState(setErrorState);

  // ===== Input Styling Helpers =====
  const setBorderStyles = (refInput, refButton, borderStyle, index) => {
    refButton.current.style.border = borderStyle;
    refInput.current.style.border = borderStyle;

    // Handle special border cases for connected input-button pairs
    if (index === 0) {
      refInput.current.style.borderLeft = "none";
      refButton.current.style.borderRight = "none";
    }
    if (index === 1 || index === 2) {
      refInput.current.style.borderRight = "none";
      refButton.current.style.borderLeft = "none";
    }
  };

  // ===== Input Event Handlers =====
  const handleMouseEnter = (refInput, refButton, index) => {
    if (!focusState[index]) {
      setBorderStyles(refInput, refButton, "1px solid black", index);
    }
  };

  const handleMouseLeave = (refInput, refButton, index) => {
    if (!focusState[index]) {
      setBorderStyles(refInput, refButton, "1px solid #848D92", index);
    }
  };

  const handleFocus = (refInput, refButton, index) => {
    refButton.current.style.backgroundColor = "#DBD936";
    setBorderStyles(refInput, refButton, "1px solid #DBD936", index);
    updateFocusState(index, true);
  };

  const handleBlur = (refInput, refButton, index) => {
    const styles = errorState[index] 
      ? {
          button: { border: "1px solid red", backgroundColor: "red", color: "white" },
          input: { border: "1px solid red" }
        }
      : {
          button: { border: "1px solid #848D92", backgroundColor: "#e2f5f9", color: "#647e8b" },
          input: { border: "1px solid #848D92" }
        };

    Object.assign(refButton.current.style, styles.button);
    Object.assign(refInput.current.style, styles.input);
    
    setBorderStyles(refInput, refButton, refInput.current.style.border, index);
    updateFocusState(index, false);
  };

  // ===== Radio Button Handlers =====
  const handleActive = (index) => {
    const containers = [choiceContainer1, choiceContainer2];
    const inputs = [choiceInput1, choiceInput2];
    
    const activeStyles = { backgroundColor: "#FAFAE0", borderColor: "#CBCE87" };
    const inactiveStyles = { backgroundColor: "white", borderColor: "#7F8D9B" };

    containers.forEach((container, i) => {
      Object.assign(container.current.style, i + 1 === index ? activeStyles : inactiveStyles);
    });

    inputs[index - 1].current.checked = true;
    
    // Clear choice error when selection is made
    setErrorStyle(prev => {
      const newStyles = [...prev];
      newStyles[3] = { ...defaultErrorStyle };
      return newStyles;
    });
  };

  // ===== Form Management =====
  const clearForm = () => {
    // Reset all form inputs
    document.querySelectorAll('input').forEach(input => {
      if (input.type === 'radio') {
        input.checked = false;
      } else {
        input.value = '';
      }
    });

    // Reset all state values
    setInputValue1("");
    setInputValue2("");
    setInputValue3("");
    setInput1("");
    setInput2("");
    setInput3("");
    setChoice(0);

    // Reset radio button styling
    [choiceContainer1, choiceContainer2].forEach(container => {
      container.current.style.backgroundColor = "white";
      container.current.style.borderColor = "#7F8D9B";
    });
  
    // Reset error states and styles
    setErrorStyle(prev => prev.map(() => defaultErrorStyle));
    setErrorState([false, false, false]);
    setPaddingInputStyle([{}, {}]);

    // Reset input field styling
    [refInput1, refInput2, refInput3].forEach((input, index) => {
      input.current.style.border = "1px solid #848D92";
      if (index === 0) {
        input.current.style.borderLeft = "none";
      } else {
        input.current.style.borderRight = "none";
      }
    });

    // Reset button styling
    [refButton1, refButton2, refButton3].forEach((button, index) => {
      button.current.style.border = "1px solid #848D92";
      button.current.style.backgroundColor = "#e2f5f9";
      button.current.style.color = "#647e8b";
      if (index === 0) {
        button.current.style.borderRight = "none";
      } else {
        button.current.style.borderLeft = "none";
      }
    });
  };

  const errorHandler = (index, shouldShow, choiceShow) => {
    // Update error message visibility
    setErrorStyle(prev => {
      const updatedArray = [...prev];
      
      if (index < 3) {
        updatedArray[index] = {
          color: "red",
          display: shouldShow ? (index === 0 ? "block" : "inline-block") : "none"
        };
      } else if (index === 3) {
        updatedArray[index] = {
          color: "red",
          display: choiceShow[0] || choiceShow[1] ? "none" : "inline-block"
        };
      }
      
      return updatedArray;
    });

    const refInputs = [refInput1, refInput2, refInput3];
    const refButtons = [refButton1, refButton2, refButton3];
    const inputValues = [inputValue1, inputValue2, inputValue3];
  
    // Update input field styling based on validation
    inputValues.forEach((input, i) => {
      const isEmpty = input === "";
     
      const styles = isEmpty
        ? {
            input: { borderColor: "red" },
            button: { borderColor: "red", backgroundColor: "red", color: "white" }
          }
        : {
            input: { border: "1px solid #848D92" },
            button: { border: "1px solid #848D92", backgroundColor: "#e2f5f9", color: "#647e8b" }
          };

      Object.assign(refInputs[i].current.style, styles.input);
      Object.assign(refButtons[i].current.style, styles.button);
    });

    if (index !== 3) {
      updateErrorState(index, shouldShow);
    }
  };

  const checkForm = () => {
    // Validate all inputs
    const inputs = [inputValue1, inputValue2, inputValue3];
    inputs.forEach((value, index) => {
      errorHandler(index, value === "", null);
    });
    
    // Validate radio button selection
    const choiceEtat = [choiceInput1.current.checked, choiceInput2.current.checked];
    errorHandler(3, null, choiceEtat);
    
    // Update padding for error messages
    setPaddingInputStyle(prev => {
      const updatedArray = [...prev];
      const needsPadding = inputValue2 === "" || inputValue3 === "";
      const paddingStyle = needsPadding ? { paddingBottom: "2.9vh" } : {};
      
      updatedArray[0] = paddingStyle;
      updatedArray[1] = paddingStyle;
      return updatedArray;
    });

    // Update result values if form is valid
    if(inputs[0]!=="" && inputs[1]!=="" && inputs[2]!=="" && (choiceInput1.current.checked || choiceInput2.current.checked)){
      setInput1(inputs[0]);
      setInput2(inputs[1]);
      setInput3(inputs[2]);
      setChoice(choiceInput1.current.checked ? 1 : 2);
    }else{
      setInput1("");
      setInput2("");
      setInput3("");
      setChoice(0);
    }
  };

  return (
    <div className='MortagageCalculator'>
      <div className='form-container'>
        <div className='header'>
          <h2>Mortgage Calculator</h2>
          <p onClick={clearForm} className='vro'>Clear All</p>
        </div>
        <label>Mortgage Amount</label>
        <div id="inputContainer1">
          <button
            ref={refButton1}
            onMouseEnter={() => handleMouseEnter(refInput1, refButton1, 0)}
            onMouseLeave={() => handleMouseLeave(refInput1, refButton1, 0)}
            onFocus={() => handleFocus(refInput1, refButton1, 0)}
            onBlur={() => handleBlur(refInput1, refButton1, 0)}
          >
            £
          </button>
          <input
            type= 'number'
            ref={refInput1}
            onMouseEnter={() => handleMouseEnter(refInput1, refButton1, 0)}
            onMouseLeave={() => handleMouseLeave(refInput1, refButton1, 0)}
            onFocus={() => handleFocus(refInput1, refButton1, 0)}
            onBlur={() => handleBlur(refInput1, refButton1, 0)}
            onChange={(e) => setInputValue1(e.target.value)}
          />
        </div>
        <span style={errorStyle[0]}>This element can't be empty</span>

        <div id="design-fix">
          <div className='inputContainer2' style={paddingInputStyle[0]}>
          <label className='label-term'>Mortgage Term</label>
          <div className='input-container'>
            <input
              type='number'
              ref={refInput2}
              onMouseEnter={() => handleMouseEnter(refInput2, refButton2, 1)}
              onMouseLeave={() => handleMouseLeave(refInput2, refButton2, 1)}
              onFocus={() => handleFocus(refInput2, refButton2, 1)}
              onBlur={() => handleBlur(refInput2, refButton2, 1)}
              onChange={(e) => setInputValue2(e.target.value)}
            />
            <button 
              ref={refButton2}
              onMouseEnter={() => handleMouseEnter(refInput2, refButton2, 1)}
              onMouseLeave={() => handleMouseLeave(refInput2, refButton2, 1)}
              onFocus={() => handleFocus(refInput2, refButton2, 1)}
              onBlur={() => handleBlur(refInput2, refButton2, 1)}
            >
              years
            </button>
            </div>
            <br/>
            <span style={errorStyle[1]}>This element can't be empty</span>
          </div>

          <div className='inputContainer2' style={paddingInputStyle[1]}>
            <label className='label-interest'>Interest Rate</label>
          <div className='input-container'>
            <input
              type='number'
              ref={refInput3}
              onMouseEnter={() => handleMouseEnter(refInput3, refButton3, 2)}
              onMouseLeave={() => handleMouseLeave(refInput3, refButton3, 2)}
              onFocus={() => handleFocus(refInput3, refButton3, 2)}
              onBlur={() => handleBlur(refInput3, refButton3, 2)}
              onChange={(e) => setInputValue3(e.target.value)}
              max="100"
            />
            <button 
              ref={refButton3}
              onMouseEnter={() => handleMouseEnter(refInput3, refButton3, 2)}
              onMouseLeave={() => handleMouseLeave(refInput3, refButton3, 2)}
              onFocus={() => handleFocus(refInput3, refButton3, 2)}
              onBlur={() => handleBlur(refInput3, refButton3, 2)}
            >
              %
            </button></div>
            <br/>
            <span style={errorStyle[2]}>This element can't be empty</span>
          </div>
          </div>

          <label>Mortgage Type</label>
          <div 
            className='choice-container'
            ref={choiceContainer1}
            onClick={() => handleActive(1)}
          >
            <input 
              type='radio' 
              id='repayment' 
              name='choice'
              ref={choiceInput1}
            />
            <label htmlFor="repayment">Repayment</label>
          </div>

          <div 
            className='choice-container'
            ref={choiceContainer2}
            onClick={() => handleActive(2)}
          >
            <input 
              type='radio' 
              id='interest' 
              name='choice'
              ref={choiceInput2}
            />
            <label htmlFor="interest">Interest Only</label>
          </div>
          <span style={errorStyle[3]}>This element can't be empty</span>

          <button 
            id="calc-button"
            onClick={checkForm}
          >
            <img src='./images/calculator.png' alt='calculator' /> Calculate Repayment
          </button>
        </div>
        <div className='result-container'>
          <YourResult input1={input1} input2={input2} input3={input3} choice={choice} />
        </div>
      </div>
    
  );
};

export default MortagageCalculator;







