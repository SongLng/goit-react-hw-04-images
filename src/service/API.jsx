import axios from 'axios';

const ServiceAPI = (q, page) => {
  const options = {
    params: {
      key: '25182566-6d97045846fa1b6cae2a84492',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 12,
      q,
      page,
    },
  };

  return axios.get('https://pixabay.com/api/', options);
};

export { ServiceAPI };
