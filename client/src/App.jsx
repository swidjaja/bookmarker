import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

import CreateBookmark from './CreateBookmark';
import ViewBookmarks from './ViewBookmarks';

import './App.scss';

const App = () => {
  return (
    <Router>
      <nav className="site-navigations" aria-label="Site Navigations">
        <div className="site">
          <Link to="/view">Home</Link>
        </div>
        <div className="site">
          <Link to="/Create">Create new bookmark</Link>
        </div>
        <div className="site">
          <Link to="/view">View your bookmarks</Link>
        </div>
      </nav>
      <Switch>
        <Route path="/create">
          <CreateBookmark />
        </Route>
        <Route path="/view">
          <ViewBookmarks />
        </Route>
      </Switch>
    </Router>
  )
};

export default App;