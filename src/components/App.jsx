import { Component } from 'react';
import { Oval } from 'react-loader-spinner';
import { ToastContainer } from 'react-toastify';
import { ServiceAPI } from '../service/API';
import { ImageGallery } from '../components/ImageGallery/ImageGallery';
import { Searchbar } from '../components/Searchbar/Searchbar';
import { Button } from '../components/Button/Button';
import { Modal } from '../components/Modal/Modal';
import '../components/styles.css';
export class App extends Component {
  state = {
    query: '',
    data: [],
    page: 1,
    error: null,
    status: 'idle',
    showModal: false,
    imgId: null,
    total: 0,
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.query !== prevState.query) {
      this.setState({ status: 'pending', data: [], page: 1 }, this.getPicture);
    }
    if (this.state.page !== prevState.page && this.state.page !== 1) {
      this.setState({ status: 'pending' }, this.getPicture);
    }
  }

  getPicture = () => {
    const { query } = this.state;
    const { page } = this.state;
    ServiceAPI(query, page)
      .then(this.dataProcessing)
      .catch(error => this.setState({ error, status: 'rejected' }));
  };

  dataProcessing = response => {
    const { hits: dataArray, totalHits } = response.data;

    if (!dataArray.length) {
      this.setState({
        status: 'rejected',
        error: new Error('Try to change the request'),
      });
      return;
    }
    window.scrollBy({
      top: document.body.clientHeight,
      behavior: 'smooth',
    });

    const newData = dataArray.map(data => {
      const {
        id,
        largeImageURL: imageURL,
        webformatURL: src,
        tags: alt,
      } = data;
      return { id, imageURL, src, alt };
    });
    return this.setState(({ data }) => {
      return {
        data: [...data, ...newData],
        total: totalHits,
        status: 'resolved',
      };
    });
  };

  handleSubmit = searchQuery => {
    if (this.state.query !== searchQuery) {
      this.setState({ query: searchQuery });
    }
    return;
  };

  handleLoadMore = () => {
    this.setState(({ page }) => {
      return { page: page + 1 };
    });
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  clickOnImage = id => {
    this.setState({ imgId: id });
    this.toggleModal();
  };

  handleData = () => {
    return this.state.data.find(img => img.id === this.state.imgId);
  };

  render() {
    const { status, error, data, showModal, total } = this.state;

    return (
      <div className="App">
        <Searchbar onSubmit={this.handleSubmit} />
        {data.length > 0 && (
          <ImageGallery data={this.state.data} onClick={this.clickOnImage} />
        )}
        {status === 'resolved' && data.length > 0 && data.length < total && (
          <>
            <Button onClick={this.handleLoadMore} />
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
          <Modal onClose={this.toggleModal}>
            <img src={this.handleData().imageURL} alt={this.handleData().alt} />
          </Modal>
        )}
      </div>
    );
  }
}
