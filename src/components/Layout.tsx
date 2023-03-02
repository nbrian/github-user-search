import { ReactElement } from "react";
import Header from "./Header";
import Menu from "./Menu";

export default function Layout({ children }: { children: ReactElement}) {
    return (
        <div>
            <Header />
            <main>{children}</main>
            <Menu />
        </div>
    )
}