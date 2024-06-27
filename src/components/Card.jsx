import "../styles/Card.css";

function Card({ image, onClick }) {
  const handleMouseMove = (e) => {
    const image = e.currentTarget.querySelector(".cardImage");
    const { top, left, width, height } =
      e.currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const rotateY = ((centerX - e.clientX) / (width / 2)) * 10;
    const rotateX = ((e.clientY - centerY) / (height / 2)) * 20;
    image.style.transform = `perspective(500px) translateZ(50px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = (e) => {
    const image = e.currentTarget.querySelector(".cardImage");
    image.style.transform = "unset";
  };

  return (
    <button
      className="card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}>
      <img className="cardImage" src={image} alt="" />
    </button>
  );
}

export default Card;
