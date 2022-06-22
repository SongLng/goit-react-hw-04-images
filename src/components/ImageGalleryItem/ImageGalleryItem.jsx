import PropTypes from 'prop-types';
import '../styles.css';
export const ImageGalleryItem = ({ images }) => {
  return (
    <li className="ImageGalleryItem" key={images.id}>
      <img
        className="ImageGalleryItem-image"
        src={images.src}
        alt={images.alt}
        data-id={images.id}
      />
    </li>
  );
};

ImageGalleryItem.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    })
  ),
};
