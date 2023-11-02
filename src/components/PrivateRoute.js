import React, {useContext} from "react";
import { Route, Redirect } from "react-router-dom"
import { AuthContext } from "./auth";

const privateRoute = ({ component: RouteComponent,
     ...rest }) => {
    const {currentUser} = useContext(AuthContext);

return (
    <Route {...rest} render={routePros => !!currentUser ? (
    <RouteComponent {...routePros} />
    ) : (
        <Redirect to={"/login"} />
    )
    }
    />
);
}

export default privateRoute