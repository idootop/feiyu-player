import { useState } from "react";
import "./App.css";
import { Button } from "./components/Button";
import { Download } from "./components/Download";

function Header() {
  return (
    <div>
      <a className="row" href="/">
        <img
          src="/logo.svg"
          style={{
            height: "28px",
            marginRight: "10px",
          }}
        />
        <p
          style={{
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          飞鱼
        </p>
      </a>
    </div>
  );
}

function Slogan() {
  return (
    <>
      <p style={{ fontSize: "3rem", fontWeight: "bold" }}>追光影，看世界</p>
      <p
        style={{
          fontSize: "2rem",
          fontWeight: "normal",
          color: "rgba(0,0,0,50%)",
        }}
      >
        The Light and Shadow, A Brighter World to See
      </p>
    </>
  );
}

function Banner() {
  return (
    <>
      <img
        className="logo"
        src="/logo.svg"
        style={{
          width: "10rem",
          height: "10rem",
        }}
      />
      <Slogan />
      <div
        style={{
          margin: "4rem 0",
          position: "relative",
        }}
      >
        <img
          src="/screenshots/home.webp"
          style={{
            width: "100%",
          }}
        />
        <p
          style={{
            background: "#fff",
            filter: "blur(16px)",
            width: "calc(100vw - 2rem)",
            height: "12rem",
            position: "absolute",
            bottom: "-2rem",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </div>
    </>
  );
}

function Search() {
  return (
    <div style={{ margin: "4rem 0" }}>
      <p style={{ fontSize: "3rem", fontWeight: "bold" }}>海量资源，随心搜索</p>
      <p
        style={{
          fontSize: "2rem",
          fontWeight: "normal",
          color: "rgba(0,0,0,50%)",
        }}
      >
        支持多种视频源，聚合搜索，看你想看。
      </p>
      <img
        src="/screenshots/search.webp"
        style={{
          width: "100%",
          marginTop: "2rem",
        }}
      />
    </div>
  );
}

function App() {
  return (
    <>
      <Header />
      <Download />
      <Banner />
      <Search />
    </>
  );
}

export default App;
