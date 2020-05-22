import { Redirect } from "../routing/routing";

export const authRedirect = (auth) => {
    if (!auth.jwt)
        return <Redirect to="/login" />
};