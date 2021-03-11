import React, { useRef, useEffect } from 'react';
import useAlert from './useAlert';
import './ErrorBox.scss';

const ErrorBox = ({ errors }) => {
  const errorBoxRef = useRef();

  const focusToInput = (theRef) => {
    theRef.focus();
  };

  useEffect(() => {
    if (errors.length && errorBoxRef.current) {
      errorBoxRef.current.focus();
    } else {
      alerter.alert('All form fields are filled! Your bookmark has been added to the database successfully!', 'polite');
    }
  }, [errors]);

  const alerter = useAlert();

  return (
    <div className="error-box" ref={errorBoxRef} role="alert" tabIndex="0" aria-atomic="true">
      <h2>Please correct the following {errors.length > 1 ? `${errors.length } errors` : 'error'} to continue!</h2>
      <ol>
        {errors.map(({errorMsg, errorInputRef}, idx) => (
          <li key={`error${idx}`}>
            {errorInputRef ? (
              <button
                className="error-go-to-input"
                onClick={() => focusToInput(errorInputRef)}
              >
                {errorMsg}
              </button>
            ) : ( <div>{errorMsg}</div>)}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ErrorBox;