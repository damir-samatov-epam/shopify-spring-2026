import {render} from 'preact';
import {LocationProvider, ErrorBoundary, Router, Route} from 'preact-iso';

import HomePage from './pages/HomePage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default async () => {
  render(<App/>, document.body);
};

function App() {
  return (
    <LocationProvider>
      <s-app-nav>
        <s-link href="/tasks">Tasks</s-link>
        <s-link href="/settings">Settings</s-link>
      </s-app-nav>
      <ErrorBoundary>
        <Router>
          <Route path="/" component={HomePage}/>
          <Route path="/tasks" component={TasksPage}/>
          <Route path="/settings" component={SettingsPage}/>
          <Route default component={NotFoundPage}/>
        </Router>
      </ErrorBoundary>
    </LocationProvider>
  );
}
