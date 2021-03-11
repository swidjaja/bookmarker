import React, { useEffect, useState } from 'react';
import useAlert from './useAlert';
import UpdateBookmarkDialog from './UpdateBookmarkDialog.jsx' 
import './ViewBookmarks.scss';

const ViewBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [updateDialogVisible, setUpdateDialogVisible] = useState(false);
  const [updateDialogBookmarkData, setUpdateDialogBookmarkData] = useState({});

  const alerter = useAlert();

  const showUpdateDialog = (bookmarkData) => {
    setUpdateDialogBookmarkData({...bookmarkData});
    setUpdateDialogVisible(true);
  };

  const updateBookmark = ({
    linkId,
    linkDescription,
    linkName,
    linkUrl,
  }) => {
    window.fetch(`http://localhost:8080/bookmark/update/${linkId}`, {
      method: 'PATCH',
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ linkDescription, linkName, linkUrl}),
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
        alerter.alert('Your new bookmark has been updated');
      } else {
        alerter.alert('Unable to update your new bookmark! Please try again later');
      }
    })
    .catch(() => {
      alerter.alert('Unable to update your new bookmark! Please try again later');
    })
    .finally(() => {
      setUpdateDialogVisible(false);
    });
  };

  const removeBookmark = (bookmarkId) => {
    return window.fetch(`http://localhost:8080/bookmark/remove/${bookmarkId}`, {
      method: 'DELETE',
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
        setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));
        alerter.alert('Your new bookmark has been deleted from database');
      } else {
        alerter.alert('Unable to delete your bookmark! Please try again later');
      }
    })
    .catch(() => {
      alerter.alert('Unable to delete your bookmark! Please try again later');
    });
  };

  const renderBookmark = (bookmark) => {
    const {
      id,
      linkDescription,
      linkName,
      linkUrl,
    } = bookmark;

    return (
      <li key={`link-${id}`}>
        <div className="bookmark">
          <div className="bookmark__name">{linkName}</div>
          <a href={linkUrl} className="bookmark__url">{linkUrl}</a>
          <div className="bookmark__description">{linkDescription}</div>
          <div className="bookmark__ctas">
            <button
              className="bookmark__cta bookmark__cta--remove"
              onClick={() => removeBookmark(id)}
            >
              <span class="sr-only">{`Remove ${linkName} bookmark`}</span>
              <span aria-hidden="true">Remove</span>
            </button>
            &nbsp;|&nbsp;
            <button className="bookmark__cta bookmark__cta--update"
              onClick={() => showUpdateDialog(bookmark)}
            >
              <span class="sr-only">{`Update ${linkName} bookmark details`}</span>
              <span aria-hidden="true">Update</span>
            </button>
          </div>
        </div>
      </li>
    );
  };

  useEffect(() => {
    window.fetch('http://localhost:8080/bookmark/view', {
        method: 'GET',
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
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
          setBookmarks(result.data);
        }
      })
      .catch(() => {
      });
  }, []);

  return (
    <>
      <h1>Your Bookmarks</h1>
      <ul className="bookmarks">
        {bookmarks.map(bookmark => renderBookmark(bookmark))}
      </ul>
      {updateDialogVisible ? 
        <UpdateBookmarkDialog
          updateDialogBookmarkData={updateDialogBookmarkData}
          updateBookmark={updateBookmark}
          setUpdateDialogVisible={setUpdateDialogVisible}
         /> : null}
    </>
  )
};

export default ViewBookmarks;
