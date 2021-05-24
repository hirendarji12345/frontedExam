import React from 'react';
import { NavLink} from 'react-router-dom';
function NavbarAdmin() {
  const logout=()=>
  {
    localStorage.setItem("Login",false);
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">

        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item ">
              <NavLink className="nav-link" to="/showuser">  Users </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/question">Question</NavLink>
            </li>

            <li className="nav-item">

              <NavLink className="nav-link" onClick={logout} exact to="/">Logout</NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default NavbarAdmin;