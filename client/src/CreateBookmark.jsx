import React, { useState} from 'react';
import CreateBookmarkForm from './CreateBookmarkForm';
import ErrorBox from './ErrorBox';
import useAlert from './useAlert';

const CreateBookmark = () => {
  const [errors, setErrors] = useState([]);
  const alerter = useAlert();

  const saveNewBookmark = (bookmarkData) => {
    return window.fetch('http://localhost:8080/bookmark/add', {
      method: 'POST',
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(bookmarkData),
    })
    .then((resp) => {
      if (resp.ok) {
        return Promise.resolve(resp);
      } else {
        return Promise.reject(new Error(resp.statusText))
      }
    })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        setErrors([]);
        alerter.alert('Your new bookmark has been added to the database');
      } else {
        setErrors([
          {
            errorMsg: 'Unable to add your bookmark! Please try again later',
          }
        ])
      }
    })
    .catch(() => {
      setErrors([
        {
          errorMsg: 'Unable to add your bookmark! Please try again later',
        }
      ])
    });
  };

  return (
    <>
      <h1>Online Bookmarker</h1>
      <h2>Fill out the following form to add a new bookmark</h2>
      {!!errors.length ? <ErrorBox errors={errors}/> : null}
      <CreateBookmarkForm
        setErrors={setErrors}
        saveNewBookmark={saveNewBookmark}
      />
    </>
  );
}

export default CreateBookmark;
