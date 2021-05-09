import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteManga } from '../../actions/mangaActions';
import { getMangas } from '../../actions/mangaActions';
import AddMangaModal from './AddMangaModal';
import ShowElements from './ShowElements';

class ShowMangas extends Component {
    componentDidMount() {
        this.props.getMangas();
      }
    static protoType = {
        manga: PropTypes.object,
        getMangas: PropTypes.func.isRequired
    }

    onDeleteClick = (id) => {
        this.props.deleteManga(id);
    }

    getStyle = () => {
        return {
            background: "#f4f4f4",
            padding: "10px",
            borderBottom: "1px #ccc dotted",
        };
    };

    render() {
        const { mangas } = this.props.manga;

        return (
            <Fragment >
                <div class="tabcontent2">
                    <AddMangaModal />
                    <ShowElements elements={mangas} onDeleteClick={this.onDeleteClick} />
                </div>

            </Fragment>
        );
    }
}
const btnRemoveStyle = {
    background: "#ff0000",
    color: "#fff",
    border: "none",
    padding: "5px 9px",
    borderRadius: "50%",
    cursor: "pointer",
    float: "right",
};

const btnEditStyle = {
    background: "orange",
    color: "#fff",
    border: "none",
    padding: "5px 9px",
    borderRadius: "50%",
    cursor: "pointer",
    float: "right",
};

const mapStateToProps = (state) => ({
    manga: state.manga,
});

export default connect(
    mapStateToProps,
    { deleteManga, getMangas }
)(ShowMangas);