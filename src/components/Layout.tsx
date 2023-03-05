import styles from "@/styles/Layout.module.css";
import { ReactElement } from "react";
import Header from "./Header";
import Menu from "./Menu";

export default function Layout({ children }: { children: ReactElement}) {
    return (
        <div className={styles.layout}>
            <Header />
            <main>{children}</main>
            <Menu />
        </div>
    )
}