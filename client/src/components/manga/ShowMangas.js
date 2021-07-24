import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Button, Alert, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Collapse } from 'react-collapse';

import { getMangas, deleteManga } from '../../actions/mangaActions';
import { getChapters ,deleteChapter } from '../../actions/chapterActions';
import AddMangaModal from './AddMangaModal';
import AddChapterModal from './AddChapterModal';
import ShowElements from './ShowElements';
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
        auth: PropTypes.object,
        manga: PropTypes.object,
        chapter: PropTypes.object,
        getChapters: PropTypes.func.isRequired,
        deleteChapter: PropTypes.func.isRequired,
        getMangas: PropTypes.func.isRequired,
        deleteManga: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.getChapters();
        this.props.getMangas();
    }

    componentDidUpdate(prevProps) {
        const { error, msg, isAuthenticated } = this.props;
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
        const { mangas } = this.props.manga;
        const { isAuthenticated } = this.props.auth;

        let dropDownSymbolList = []
        // this.state.Collapsetoggle.map((element)=>{
        //     dropDownSymbol =  [...dropDownSymbol, element]
        //     })
        //     console.log(dropDownSymbol)
        
        chapters.map(({ name }) => { dropDownSymbolList = [...dropDownSymbolList, this.state.Collapsetoggle.includes(name) ? { name: <span>&#45;</span> } : { name: <span>&#x2B;</span> }] })
        // console.log(dropDownSymbolList[0].name)
        const dropDownSymbol = this.state.Collapsetoggle ? <span>&#45;</span> : <span>&#x2B;</span>


        // if (chapters) {
        //     let Collapsetoggle = chapters.map(({ name }) => name);
        //     console.log(Collapsetoggle);
        //     // this.setState({Collapsetoggle});
        // }

        return (
            <Fragment >
                <div class="tabcontent2">
                    <div align='center' style={bodyStyle}>
                        <div className='chapter-list position-relative mx-5 py-3 px-4'>
                            <AddChapterModal />
                            {chapters && chapters.map(({ _id, name, mangas }, index) => (
                                <Fragment key={_id}>
                                    <span className={'chapter-item'}>
                                        <Button
                                            block
                                            size='sm'
                                            color='info'
                                            onClick={this.CollapseHangdle.bind(this, name)}
                                            style={{ marginBottom: '1rem', opacity: '0.7' }}
                                        >{name}<strong class='pr-3' style={{ position: 'absolute', right: '0' }}>{dropDownSymbolList[index].name}</strong></Button>
                                        <button onClick={this.onDeleteChapterClick.bind(this, _id)} className="chapter-delete-btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                            </svg>
                                        </button>
                                        <EditChapterModal chapterID={_id} />
                                    </span>

                                    <Collapse isOpened={this.state.Collapsetoggle.includes(name)}>
                                        <AddMangaModal chapter={name} />

                                        <ListGroup className="manga-list">
                                            <TransitionGroup className='pt-3 pb-3'>
                                                {mangas && mangas.sort((a, b) => Number(a.page.substring(4)) - Number(b.page.substring(4))).map(({ _id, page, inuse }) => (
                                                    <CSSTransition key={_id} timeout={500} classNames='fade'>
                                                        <ListGroupItem className={'manga-item ' + (inuse ? 'minus' : 'plus')}>
                                                            <span>{page}</span>
                                                            <button onClick={this.onDeleteMangaClick.bind(this, _id)} className="delete-btn">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                                </svg>
                                                            </button>
                                                            <EditMangaModal mangaID={_id} />
                                                        </ListGroupItem>
                                                    </CSSTransition>
                                                ))}
                                            </TransitionGroup>
                                        </ListGroup>
                                    </Collapse>
                                </Fragment>
                            ))}
                        </div>

                        {/* <ListGroup style={{ maxWidth: '600px', textAlign: 'right' }}>
                            <TransitionGroup className='pt-3 pb-3'>
                                {mangas && mangas.map(({ _id, page }) => (
                                    <CSSTransition key={_id} timeout={500} classNames='fade'>
                                        <ListGroupItem className='mt-1' style={this.getStyle()}>
                                            {isAuthenticated ?
                                                <div>
                                                    <Button
                                                        style={btnRemoveStyle}
                                                        // style={{right: '0'}}
                                                        className='remove-btn-admin'
                                                        color='danger'
                                                        size='sm'
                                                        onClick={this.onDeleteMangaClick.bind(this, _id)}
                                                    >&#10007;</Button>
                                                    <EditMangaModal mangaID={_id} />
                                                </div>
                                                : null}
                                            <span class="ml-4">{page}</span>
                                        </ListGroupItem>
                                    </CSSTransition>
                                ))}
                            </TransitionGroup>
                        </ListGroup> */}




                        {/* <AddMangaModal />

                        <ul className="manga-list">
                            <TransitionGroup className='pt-3 pb-3'>
                                {mangas && mangas.map(({ _id, page }) => (
                                    <CSSTransition key={_id} timeout={500} classNames='fade'>
                                        <li className="manga-item minus" key={_id}>
                                            <span>{page}</span><button onClick={() => deleteManga(_id)} className="delete-btn">x</button>
                                            <button onClick={() => deleteManga(_id)} className="edit-btn">x</button>
                                        </li>
                                    </CSSTransition>
                                ))}
                            </TransitionGroup>
                        </ul> */}


                    </div>
                    <Modal
                        align="right"
                        isOpen={this.state.modal}
                        toggle={this.toggle}
                    >
                        <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle} >
                            <span class="lead">Error Message</span>
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
// const btnRemoveStyle = {
//     background: "#ff0000",
//     color: "#fff",
//     border: "none",
//     padding: "5px 9px",
//     borderRadius: "50%",
//     cursor: "pointer",
//     float: "right",
// };

// const btnEditStyle = {
//     background: "orange",
//     color: "#fff",
//     border: "none",
//     padding: "5px 9px",
//     borderRadius: "50%",
//     cursor: "pointer",
//     float: "right",
// };
const bodyStyle = {
    WebkitBorderRadius: '10px',
    MozBorderRadius: '10px',
    borderRadius: '10px',
    margin: '0 auto',
    backgroundColor: '#323232',
    color: 'white',
    width: '65%',
    fontFamily: "'Brawler', Cyreal"
};

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
    chapter: state.chapter,
    manga: state.manga,
    auth: state.auth,
    msg: state.msg,
    error: state.error,
});

export default connect(
    mapStateToProps,
    { deleteManga, getMangas, deleteChapter, getChapters, clearErrors, clearMsgs }
)(ShowMangas);