import { Component } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Section from "components/Section";
import ImageGallery from "components/ImageGallery";
import Button from "components/Button";
import Loader from "components/Loader";
import PixabayApiService from "js/PixabayApiService";
import s from "./Gallery.module.css";

const pixabayApiService = new PixabayApiService();

class Gallery extends Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    onImageClick: PropTypes.func.isRequired,
  };
  state = {
    images: [],
    status: "idle",
    error: "",
    more: false,
  };
  componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevProps.query;
    const query = this.props.query;
    if (prevQuery !== query) {
      this.setState({ images: [] });
      pixabayApiService.resetPage();
      this.getImages(query);
    }
  }
  getImages = async (query) => {
    const { error } = this.state;

    if (error) {
      this.setState({ status: "loading", error: "" });
    }
    this.setState({ more: true });
    pixabayApiService.query = query;
    try {
      const response = await pixabayApiService.getImages();
      this.onSuccess(response);
    } catch (response) {
      this.onError(response);
    }
    this.setState({ more: false });
    if (!this.state.error) setTimeout(this.scrollCard, 500);
  };
  onSuccess = (response) => {
    const totalHits = response.totalHits;
    if (!totalHits) {
      const error = "Can't find image";
      this.setState({ status: "error", error });
      return;
    }

    const newImages = response.hits;

    if (newImages.length === 0 && totalHits !== 0) {
      const error =
        "We're sorry, but you've reached the end of search results.";
      toast.error(error);
      this.setState({ error });
      return;
    }

    if (pixabayApiService.page === 2) {
      toast.success(`We found ${totalHits} images!`);
    }

    this.setState((prevState) => {
      const images = [...prevState.images, ...newImages];
      return { status: "success", images };
    });
  };
  onError = (error) => {
    const errorMsg =
      error.response.status === 400
        ? "We're sorry, but you've reached the end of search results."
        : "Sorry, there is no response from server. Please try again.";
    toast.error(errorMsg);
    this.setState({ error: errorMsg });
  };
  scrollCard = () => {
    const { height: cardHeight } = document
      .querySelector("#gallery")
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 3,
      behavior: "smooth",
    });
  };
  render() {
    const { status, images, error, more } = this.state;
    const { query, onImageClick } = this.props;

    if (status === "idle") return <div></div>;

    if (status === "loading") return <Loader />;

    if (status === "error") {
      return (
        <p className={s.error}>
          {error}: {query}
        </p>
      );
    }

    if (status === "success") {
      return (
        <Section>
          <ImageGallery images={images} onImageClick={onImageClick} />
          {more && <Loader />}
          {!more && !error && (
            <Button
              type="button"
              text="Load more"
              className="center"
              query={query}
              onClick={this.getImages}
            />
          )}
        </Section>
      );
    }
  }
}

export default Gallery;
