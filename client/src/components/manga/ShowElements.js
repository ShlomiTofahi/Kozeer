
import React, { Component, Fragment } from 'react';
import { ListGroup, ListGroupItem, Button, Alert, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';

import EditMangaModal from './EditMangaModal';


class ShowElements extends Component {
  state = {
    modal: false
  };
  static protoType = {
    auth: PropTypes.object,
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

  onDeleteClick = (id) => {
    this.props.onDeleteClick(id);
  }

  onEditClick = (id) => {
    //TODO
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
    const { isAuthenticated } = this.props.auth;
    const elements = this.props.elements

    return (
      <Fragment >
        <ListGroup style={{ maxWidth: '600px', textAlign: 'right' }}>
          <TransitionGroup className='pt-3 pb-3'>
            {elements && elements.map(({ _id, page }) => (
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
                        onClick={this.onDeleteClick.bind(this, _id)}
                      >&#10007;</Button>
                      <EditMangaModal mangaID={_id} />

                      {/* <Button
                        style={btnEditStyle}
                        className='edit-btn-admin'
                        title='ערוך'
                        color='warning'
                        size='sm'
                        onClick={this.onEditClick.bind(this, _id)}
                      >&#x2711;</Button> */}
                    </div>
                    : null}
                  <span class="ml-4">{page}</span>
                </ListGroupItem>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ListGroup>
        <Modal
          align="right"
          isOpen={this.state.modal}
          toggle={this.toggle}
        >
          <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle} >
            <span class="lead">הודעת שגיאה</span>
          </ModalHeader>

          <ModalBody>
            {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
          </ModalBody>
        </Modal>
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
  auth: state.auth,
  msg: state.msg,
  error: state.error,
});

export default connect(
  mapStateToProps,
  { clearErrors, clearMsgs }
)(ShowElements);