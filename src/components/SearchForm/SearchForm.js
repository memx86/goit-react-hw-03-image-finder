import { Component } from "react";
import PropTypes from "prop-types";
import s from "./SearchForm.module.css";
import IconButton from "components/IconButton";

class SearchForm extends Component {
  static propTypes = {
    onFormSubmit: PropTypes.func.isRequired,
  };
  state = {
    query: "",
  };
  handleInputChange = (e) => {
    const value = e.target.value;
    this.setState({ query: value });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { onFormSubmit } = this.props;
    const query = this.state.query;
    onFormSubmit(query);
    this.reset();
  };
  reset = () =>
    this.setState(() => ({
      query: "",
    }));

  render() {
    const { query } = this.state;
    return (
      <form className={s.form} onSubmit={this.handleSubmit}>
        <label className={s.label}>
          <span className={s.btn}>
            <IconButton type="submit" icon="search" />
          </span>
          <input
            className={s.input}
            type="text"
            name="query"
            placeholder="Search images and photos"
            required
            value={query}
            onInput={this.handleInputChange}
          />
        </label>
      </form>
    );
  }
}
export default SearchForm;
