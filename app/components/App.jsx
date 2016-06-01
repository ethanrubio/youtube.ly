import React from 'react';
import SearchBar from './search_bar.jsx';

const App = React.createClass({
  render() {
    return (
      <div>
        <div className="col-md-7">
          <SearchBar />
        </div>
        <div className="col-md-5">
        </div>
      </div>
    );
  }
});

export default App;
