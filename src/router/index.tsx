import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { RegistrationProvider } from "~/hooks/useRegistration";
import DashboardPage from "~/pages/Dashboard";
import NewUserPage from "~/pages/NewUser";
import routes from "./routes";

const Router = () => {
  return (
    <div style={{ marginTop: 64 }}>
      <HashRouter>
        <RegistrationProvider>
          <Switch>
            <Route exact path={routes.dashboard} component={DashboardPage} />
            <Route exact path={routes.newUser} component={NewUserPage} />
            <Route
              exact
              path={routes.history}
              component={() => <div>History</div>}
            />

            <Route exact path="*">
              <Redirect to={routes.dashboard} />
            </Route>
          </Switch>
        </RegistrationProvider>
      </HashRouter>
    </div>
  );
};

export default Router;
