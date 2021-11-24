import React, { useState } from "react";

import { Link } from "react-scroll";

import "./styles.css";

export default function BurgerMenu({ handleModalEscolha, handleModalLogin }) {
  const [showBurger, setShowBurger] = useState(false);

  const handleClickOption = () => {
    setShowBurger(false);
  };

  return (
    <>
      <aside onClick={() => setShowBurger(!showBurger)} id="burger">
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </aside>
      {showBurger && (
        <div className="burger-fade">
          <button onClick={() => setShowBurger(false)} />
        </div>
      )}

      <div className={`menu-options-burger ${showBurger && "active-burger"}`}>
        <div className="burger-login-opt">
            <li>
              <button
                type="button"
                className="burger-logon"
                onClick={() => {
                  handleModalEscolha();
                  setShowBurger(false);
                }}
              >
                Cadastrar-se
              </button>
            </li>
            <li>
              <button
                type="button"
                className="burger-login "
                onClick={() => {
                  handleModalLogin();
                  setShowBurger(false);
                }}
              >
                Fazer Login
              </button>
            </li>
          </div>
      </div>
    </>
  );
}
