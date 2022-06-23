import { useState, useEffect } from 'react';

import { Oval } from 'react-loader-spinner';
import { ToastContainer } from 'react-toastify';
import { ServiceAPI } from '../service/API';
import { ImageGallery } from '../components/ImageGallery/ImageGallery';
import { Searchbar } from '../components/Searchbar/Searchbar';
import { Button } from '../components/Button/Button';
import { Modal } from '../components/Modal/Modal';
import '../components/styles.css';

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');
  const [showModal, setShowModal] = useState(false);
  const [imgId, setImgId] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    const getPicture = () => {
      setStatus('pending');
      ServiceAPI(searchQuery, page)
        .then(dataProcessing)
        .catch(error => {
          setError(error);
          setStatus('rejected');
        });
    };
    getPicture();
  }, [page, searchQuery]);

  const dataProcessing = response => {
    const { hits: dataArray, totalHits } = response.data;

    if (!dataArray.length) {
      setStatus('rejected');
      setError(
        new Error('Something went wrong, please change the request please')
      );
      return;
    }

    window.scrollBy({
      top: document.body.clientHeight,
      behavior: 'smooth',
    });

    const data = dataArray.map(data => {
      const {
        id,
        largeImageURL: imageURL,
        webformatURL: src,
        tags: alt,
      } = data;
      return { id, imageURL, src, alt };
    });
    setData(state => [...state, ...data]);
    setTotal(totalHits);
    setStatus('resolved');
  };

  const handleSubmit = newSearchQuery => {
    if (searchQuery !== newSearchQuery) {
      setSearchQuery(newSearchQuery);
      setPage(1);
      setData([]);
    }
    return;
  };

  const handleLoadMore = () => {
    setPage(state => state + 1);
  };

  const toggleModal = () => {
    setShowModal(state => !state);
  };

  const clickOnImage = id => {
    setImgId(id);
    toggleModal();
  };

  const handleData = () => {
    return data.find(data => data.id === imgId);
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleSubmit} />
      {data.length > 0 && <ImageGallery data={data} onClick={clickOnImage} />}
      {status === 'resolved' && data.length > 0 && data.length < total && (
        <>
          <Button onClick={handleLoadMore} />
        </>
      )}
      <ToastContainer />
      {status === 'pending' && (
        <div className="Oval">
          <Oval
            ariaLabel="loading-indicator"
            height={100}
            width={100}
            strokeWidth={5}
            color="white"
            secondaryColor="#3f51b5"
          />
        </div>
      )}

      {status === 'rejected' && (
        <div className={ImageGallery}>
          <p>{`There are no such an image ${error}`}</p>
        </div>
      )}

      {showModal && (
        <Modal onClose={toggleModal}>
          <img src={handleData().imageURL} alt={handleData().alt} />
        </Modal>
      )}
    </div>
  );
}
