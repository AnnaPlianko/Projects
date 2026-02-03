
import { Header } from "../Header/Header";
import { NavBar } from "../NavBar/NavBar";
import { Routing } from "../Routing/Routing";
import "./Layout.css";

export function Layout() {
    return (
        <div className="Layout">

            <header>
                <Header />
            </header>

            <aside>
                <NavBar />

            </aside>

            <main className="MainContent">

                <Routing />


            </main>

            <footer>

            </footer>

        </div>




    );
}
