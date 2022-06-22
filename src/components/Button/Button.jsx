import PropTypes from 'prop-types';
import '../styles.css';

export const Button = ({ onClick }) => {
  return (
    <button className="Button" type="button" onClick={onClick}>
      Load More
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
};
