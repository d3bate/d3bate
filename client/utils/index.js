import { Redirect } from "../routing";

export const authRedirect = (auth) => {
    if (!auth.jwt)
        return <Redirect to="/login" />
};