/**
 * Root Component
 */
import React from 'react';
import { render } from 'react-dom';
// import { Provider } from 'react-redux';

import HeaderWrapper from './container/header';
import ContentWrapper from './container/content';
import Footer from './container/footer';
import {
  BrowserRouter,
  Route,
  Link
} from 'react-router-dom'


// import IntlWrapper from './modules/Intl/IntlWrapper';

// Import Routes
// import routes from './routes';

// Base stylesheet
// require('./main.css');

// export default function App(props) {
//   return (
//     <Provider store={props.store}>
//       <IntlWrapper>
//         <Router history={browserHistory}>
//           {routes}
//         </Router>
//       </IntlWrapper>
//     </Provider>
//   );
// }
//
// App.propTypes = {
//   store: React.PropTypes.object.isRequired,
// };
//
//
const RootComponent = () => (
  <div>
    <HeaderWrapper/>
    <ContentWrapper/>
    {/* <Footer/> */}

  </div>
)

export default function App(){
  return (
      <RootComponent/>
  );
}
