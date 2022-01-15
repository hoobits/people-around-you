import { Link } from "react-router-dom";

export default function Main() {
    return (
      <main style={{ padding: "1rem 0" }}>
         <div>
          <h1>Bookkeeper</h1>
          <nav
            style={{
              borderBottom: "solid 1px",
              paddingBottom: "1rem"
            }}
          >
            <Link to="/invoices">Invoices</Link> |{" "}
            <Link to="/expenses">Expenses</Link>
          </nav>
        </div>
      </main>
    );
  }