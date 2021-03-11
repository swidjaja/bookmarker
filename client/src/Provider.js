import React, { useEffect } from 'react';
import AppContext from './Context';
import { ALERT } from './const';

const Provider = (props) => {
  const {
    children,
  } = props;

  const createAndAppendAlertContainer = (mode) => {
    let containerId = ALERT.ASSERTIVE.containerId;
    let ariaLiveAttr = ALERT.ASSERTIVE.ariaLiveAttr;

    if (mode === 'polite') {
      containerId = ALERT.POLITE.containerId;
      ariaLiveAttr = ALERT.POLITE.ariaLiveAttr;
    }

    const alertContainer = document.createElement('div');
    alertContainer.id = containerId;
    alertContainer.classList.add('sr-only');
    alertContainer.setAttribute('aria-live', ariaLiveAttr);
    document.body.append(alertContainer);
  }


  useEffect(() => {
    if (!document.getElementById(ALERT.ASSERTIVE.containerId)) {
      createAndAppendAlertContainer('assertive');
    }

    if (!document.getElementById(ALERT.POLITE.containerId)) {
      createAndAppendAlertContainer('polite');
    }
  });

  const alerter = {
    alert: (msg, mode = 'assertive') => {
      const alertContainer = document.getElementById(mode === 'assertive' ? ALERT.ASSERTIVE.containerId : ALERT.POLITE.containerId);

      if (alertContainer) {
        alertContainer.innerHTML = msg;

        setTimeout(() => {
          // VO seems to be much less responsive if we just setting this to empty string
          alertContainer.innerHTML = '&nbsp;';
        }, 250); // Need to give some time for VO to grasp the msg
      }      
    },
  };
  
  return (
    <AppContext.Provider value={alerter}>
      {children}
    </AppContext.Provider>
  )
};

export default Provider;
