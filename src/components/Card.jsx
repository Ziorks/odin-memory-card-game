import "../styles/Card.css";

function Card({ image, description, onClick }) {
  const handleMouseMove = (e) => {
    const image = e.currentTarget.querySelector(".cardImage");
    const { top, left, width, height } =
      e.currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const rotateY = ((centerX - e.clientX) / (width / 2)) * 7;
    const rotateX = ((e.clientY - centerY) / (height / 2)) * 5;
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
      onClick={(e) => {
        onClick(e);
        handleMouseLeave(e);
      }}
    >
      <img className="cardImage" src={image} alt={description} />
    </button>
  );
}

export default Card;
