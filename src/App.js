import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Countries from './Countries';
import Country from './Country';

function App() {
  return (
    <BrowserRouter>
      <Switch>
          <Route path='/country/:id' render={ props => <Country {...props} />} />
          
          <Route path='/'><Countries /></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
