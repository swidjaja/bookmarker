import React, { useEffect, useRef } from 'react';
import './UpdateBookmarkDialog.scss';

const UpdateBookmarkDialog = (props) => {
  const {
    updateBookmark = () => {},
    updateDialogBookmarkData: {
      id = '',
      linkName = '',
      linkUrl = '',
      linkDescription = '',
    } = {},
    setUpdateDialogVisible = () => {}
  } = props;

  const bookmarkLinkRef = useRef();
  const bookmarkUrlRef = useRef();
  const bookmarkDescRef = useRef();
  const dialogRef = useRef();

  useEffect(() => {
    if (dialogRef && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [dialogRef]);

  const onUpdateBookmark = () => updateBookmark({
    linkId: id,
    linkName: bookmarkLinkRef && bookmarkLinkRef.current && bookmarkLinkRef.current.value,
    linkUrl: bookmarkUrlRef && bookmarkUrlRef.current && bookmarkUrlRef.current.value,
    linkDescription: bookmarkDescRef && bookmarkDescRef.current && bookmarkDescRef.current.value,
  });

  const closeDialog = () => setUpdateDialogVisible(false);

  return (
    <div className="update-bookmark-dialog-container">
      <div
        className="update-bookmark-dialog"
        ref={dialogRef}
        role="dialog"
        tabIndex="-1"
      >
        <section className="update-bookmark-dialog__header">
          <h2>Update your bookmark</h2>
          <button
            className="update-bookmark-dialog__close"
            onClick={closeDialog}
          >
            <span class="sr-only">Close dialog</span>
            X
          </button>
        </section>
        <div className="update-bookmark-dialog__form">
          <div className="form-pair">
            <div className="form-pair__label">
              <label htmlFor="bookmarkLink">
                Link Name:
              </label>
            </div>
            <div className="form-pair__input">
              <input
                aria-describedby="bookmarkLinkError"
                ref={bookmarkLinkRef}
                type="text"
                id="bookmarkLink"
                defaultValue={linkName}
                required
              />
            </div>
          </div>

          <div className="form-pair">
            <div className="form-pair__label">
              <label htmlFor="bookmarkUrl">
                Link URL:
              </label>
            </div>
            <div className="form-pair__input">
              <input
                ref={bookmarkUrlRef}
                type="text"
                id="bookmarkUrl"
                autoComplete="url"
                defaultValue={linkUrl}
                required />
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
                defaultValue={linkDescription || ''}
              />
            </div>
          </div>

          <div className="update-bookmark-dialog__ctas">
            <button onClick={() => onUpdateBookmark()}>
              <span className="sr-only">{`Update ${linkName} bookmark details`}</span>
              <span aria-hidden="true">Update</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBookmarkDialog;
