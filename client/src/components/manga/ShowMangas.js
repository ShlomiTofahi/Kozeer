import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Button, Alert, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Collapse } from 'react-collapse';

import { getMangas, deleteManga } from '../../actions/mangaActions';
import { getChapters, deleteChapter } from '../../actions/chapterActions';
import AddMangaModal from './AddMangaModal';
import AddChapterModal from './AddChapterModal';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';

import EditMangaModal from './EditMangaModal';
import EditChapterModal from './EditChapterModal';

class ShowMangas extends Component {
    state = {
        modal: false,
        Collapsetoggle: [],
    };

    static protoType = {
        manga: PropTypes.object,
        chapter: PropTypes.object,
        msg: PropTypes.object,
        error: PropTypes.object,
        getChapters: PropTypes.func.isRequired,
        deleteChapter: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        clearMsgs: PropTypes.func.isRequired,
        getMangas: PropTypes.func.isRequired,
        deleteManga: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.getChapters();
        this.props.getMangas();
    }

    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
            // Check for register error
            if (error.id === 'DELETE_FAIL') {
                this.setState({ msg: error.msg, modal: true });
            } else {
                this.setState({ msg: null, modal: false });
            }
        }
    }

    CollapseHangdle = (name) => {
        if (this.state.Collapsetoggle.includes(name)) {
            this.setState(prevState => ({
                Collapsetoggle: prevState.Collapsetoggle.filter(element => element !== name)
            }));
        } else {
            this.setState(prevState => ({
                Collapsetoggle: [...prevState.Collapsetoggle, name]
            }));
        }
    }

    onDeleteChapterClick = (id) => {
        this.props.deleteChapter(id);
    }

    onDeleteMangaClick = (id) => {
        this.props.deleteManga(id);
    }

    toggle = () => {
        // Clear errors
        this.props.clearErrors();
        // Clear msgs
        this.props.clearMsgs();

        this.setState({
            modal: !this.state.modal
        });
    }

    getStyle = () => {
        return {
            background: "#f4f4f4",
            padding: "10px",
            borderBottom: "1px #ccc dotted",
        };
    };



    render() {
        const { chapters } = this.props.chapter;

        let dropDownSymbolList = []

        chapters.map(({ name }) => {
            dropDownSymbolList = [...dropDownSymbolList, this.state.Collapsetoggle.includes(name) ? { name: <span>&#45;</span> } : { name: <span>&#x2B;</span> }]
            return dropDownSymbolList;
        })
        // const dropDownSymbol = this.state.Collapsetoggle ? <span>&#45;</span> : <span>&#x2B;</span>

        return (
            <Fragment >
                <div className="tabcontent2">
                    <div align='center' style={bodyStyle}>
                        <div className='chapter-list position-relative mx-4 py-3 px-5'>
                            <AddChapterModal />
                            {chapters && chapters.map(({ _id, name, mangas }, index) => (
                                <Fragment key={_id}>
                                    <span className='chapter-item'>
                                        <Button
                                            block
                                            size='sm'
                                            color='info'
                                            onClick={this.CollapseHangdle.bind(this, name)}
                                            style={{ marginBottom: '1rem', opacity: '0.7' }}
                                        >{name}<strong className='pr-3' style={{ position: 'absolute', right: '0' }}>{dropDownSymbolList[index].name}</strong></Button>
                                        <button onClick={this.onDeleteChapterClick.bind(this, _id)} className="chapter-delete-btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                            </svg>
                                        </button>
                                        <EditChapterModal chapterID={_id} />
                                    </span>

                                    <Collapse isOpened={this.state.Collapsetoggle.includes(name)}>
                                        <AddMangaModal chapter={name} />

                                        <div className="scrolling-box manga-scrolling-box mt-2">
                                            <ListGroup className="manga-list">
                                                <TransitionGroup className='pt-3 pb-3'>
                                                    {mangas && mangas.sort((a, b) => Number(a.page.substring(4)) - Number(b.page.substring(4))).map(({ _id: mangaid, page, inuse }) => (
                                                            <CSSTransition key={mangaid} timeout={500} classNames='fade'>
                                                                <ListGroupItem className={'manga-item ' + (inuse ? 'minus' : 'plus')}>
                                                                    <span>{page}</span>
                                                                    <button onClick={this.onDeleteMangaClick.bind(this, mangaid)} className="delete-btn">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                                        </svg>
                                                                    </button>
                                                                    <EditMangaModal mangaID={mangaid} />
                                                                </ListGroupItem>
                                                            </CSSTransition>
                                                    ))}
                                                </TransitionGroup>
                                            </ListGroup>
                                        </div>
                                    </Collapse>
                                </Fragment>
                            ))}
                        </div>
                    </div>
                    <Modal
                        align="right"
                        isOpen={this.state.modal}
                        toggle={this.toggle}
                    >
                        <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle} >
                            <span className="lead">Error Message</span>
                        </ModalHeader>

                        <ModalBody>
                            {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
                        </ModalBody>
                    </Modal>
                </div>

            </Fragment>
        );
    }
}

const bodyStyle = {
    WebkitBorderRadius: '10px',
    MozBorderRadius: '10px',
    borderRadius: '10px',
    margin: '0 auto',
    backgroundColor: '#323232',
    color: 'white',
    width: window.innerWidth >= 992 ? '65%' : '90%',
    fontFamily: "'Brawler', Cyreal"
};

const mapStateToProps = (state) => ({
    chapter: state.chapter,
    manga: state.manga,
    msg: state.msg,
    error: state.error,
});

export default connect(
    mapStateToProps,
    { deleteManga, getMangas, deleteChapter, getChapters, clearErrors, clearMsgs }
)(ShowMangas);