import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <div className="title">Memory Card Game</div>
      <p className="instructions">
        Click each card only once. Game gets harder each round.
      </p>
    </header>
  );
}

export default Header;
