import React from "react";
import Link from "next/link";
import HeaderHomepage from "@/common/components/HeaderHomepage";

export default function NotFound() {
  return (
    <>
      <HeaderHomepage />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 200px)",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>404</h1>
        <p style={{ fontSize: "18px", marginBottom: "30px" }}>
          Pagina pe care o cauți nu a fost găsită.
        </p>
        <Link
          href="/"
          style={{
            color: "var(--primary-color)",
            textDecoration: "none",
            fontSize: "16px",
          }}
        >
          Înapoi la pagina principală
        </Link>
      </div>
    </>
  );
}