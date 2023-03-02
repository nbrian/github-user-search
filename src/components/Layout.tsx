import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectedTheme, toggleTheme } from "@/store/themeSlice";
import { ReactElement, useEffect } from "react";
import Header from "./Header";
import Menu from "./Menu";

export default function Layout({ children }: { children: ReactElement}) {
    const { theme } = useAppSelector(selectedTheme);
    const dispatch = useAppDispatch();

    //dispatch initial system theme
    useEffect(() => {
        document.documentElement.className = theme;

        const systemMatchStore = window.matchMedia(`(prefers-color-scheme: ${theme})`).matches;
        if(!systemMatchStore) {
            dispatch(toggleTheme(theme));
        }

        // add system theme event trigger
        window.matchMedia(`(prefers-color-scheme: ${theme})`)
            .addEventListener('change', event => {
                dispatch(toggleTheme(theme));
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            {/* <Provider store={store}> */}
                <Header />
                <main>{children}</main>
                <Menu />
            {/* </Provider> */}
        </div>
    )
}