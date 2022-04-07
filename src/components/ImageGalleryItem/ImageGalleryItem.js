import PropTypes from "prop-types";
import s from "./ImageGalleryItem.module.css";

export default function ImageGalleryItem({ image, onClick }) {
  const { webformatURL, largeImageURL, tags } = image;
  return (
    <li className={s.item} onClick={onClick}>
      <img
        className={s.img}
        src={webformatURL}
        alt={tags}
        data-src={largeImageURL}
      />
    </li>
  );
}
ImageGalleryItem.propTypes = {
  image: PropTypes.shape({
    webformatURL: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
