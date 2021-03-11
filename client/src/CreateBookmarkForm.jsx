import React, { useRef } from 'react';
import './CreateBookmarkForm.scss';

/**
 * This form uses two patterns on form submission error
 * 1. On submit, focus is set on the error box so user is aware of error(s). Click on
 * the error will set focus on problematic field
 * 2. Once user fixes the problematic field, user can use heading navigation to navigate
 * quickly to the error box. If user chooses to keep navigating forward, each remaining
 * problematic field will now have the corresponding error message which will be read
 * out by SR
 */

const CreateBookmarkForm = (props) => {
  const {
    setErrors,
    saveNewBookmark,
  } = props;

  const bookmarkLinkRef = useRef();
  const bookmarkUrlRef = useRef();
  const bookmarkDescRef = useRef();
  const bookmarkLinkErrorRef = useRef();
  const bookmarkUrlErrorRef = useRef();

  const validateForm = (evt) => {
    evt.preventDefault();

    const errors = [];
    if (!bookmarkLinkRef.current.value) {
      errors.push({ errorMsg: 'Bookmark name is missing', errorInputRef: bookmarkLinkRef.current });
      bookmarkLinkErrorRef.current.innerHTML = "Bookmark name is missing";
      bookmarkLinkErrorRef.current.hidden = false;
    } else {
      bookmarkLinkErrorRef.current.innerHTML = '';
      bookmarkLinkErrorRef.current.hidden = true;
    }

    if (!bookmarkUrlRef.current.value) {
      errors.push({ errorMsg: 'Bookmark url is missing', errorInputRef: bookmarkUrlRef.current });
      bookmarkUrlErrorRef.current.innerHTML = "Bookmark url is missing";
      bookmarkUrlErrorRef.current.hidden = false;
    } else {
      bookmarkUrlErrorRef.current.innerHTML = '';
      bookmarkUrlErrorRef.current.hidden = true;
    }

    setErrors(errors);

    if (!errors.length) {
      saveNewBookmark({
        linkName: bookmarkLinkRef.current.value,
        linkUrl: bookmarkUrlRef.current.value,
        linkDescription: (bookmarkDescRef && bookmarkDescRef.current && bookmarkDescRef.current.value) || '',
      });
    }
  }

  return (
    <form
      onSubmit={validateForm}
      noValidate
    >
      <div className="form-pair">
        <div className="form-pair__label">
          <label
            className={bookmarkLinkErrorRef && bookmarkLinkErrorRef.current && bookmarkLinkErrorRef.current.innerHTML ? 'input-error': ''}
            htmlFor="bookmarkLink"
          >
            Link Name (Required)
          </label>
        </div>
        <div className="form-pair__input">
          <input
            aria-describedby="bookmarkLinkError"
            ref={bookmarkLinkRef} type="text" id="bookmarkLink" required />
          <div
            className="form-pair__input-error"
            id="bookmarkLinkError"
            ref={bookmarkLinkErrorRef}
            hidden
          >
            
          </div>
        </div>
      </div>

      <div className="form-pair">
        <div className="form-pair__label">
          <label
            className={bookmarkUrlErrorRef && bookmarkUrlErrorRef.current && bookmarkUrlErrorRef.current.innerHTML ? 'input-error': ''}
            htmlFor="bookmarkUrl"
          >
            Link URL (Required)
          </label>
        </div>
        <div className="form-pair__input">
          <input
            aria-describedby="bookmarkUrlError"
            ref={bookmarkUrlRef} type="text" id="bookmarkUrl" autoComplete="url" required />
          <div
            className="form-pair__input-error"
            id="bookmarkUrlError"
            hidden
            ref={bookmarkUrlErrorRef}
          >
            
          </div>
        </div>
      </div>

      <div className="form-pair">
        <div className="form-pair__label">
          <label htmlFor="bookmarkDesc">Link Description</label>
        </div>
        <div className="form-pair__input">
          <input
            ref={bookmarkDescRef}
            type="text"
            id="bookmarkDesc"
          />
        </div>
      </div>

      <div className="form-ctas">
        <input type="submit" value="Add Bookmark" />
      </div>
    </form>
  );
};

export default CreateBookmarkForm;
