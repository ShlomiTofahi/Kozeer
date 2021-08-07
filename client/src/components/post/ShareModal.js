import React, { Fragment, useState } from 'react'
import { Container, Modal, ModalBody, Col, Row } from 'reactstrap';

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  PinterestShareButton,

  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  PinterestIcon,
} from "react-share";

export const ShareModal = () => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const url = String(window.location)
  const title = "Kozeer Website"
  const shareImage = "https://www.steadylearner.com/static/images/brand/prop-passer.png"
  const size = "2.5rem"
  const iconFillColor = 'white'
  const bgStyle = { opacity: 1 }

  return (
    <Fragment>
      <div align='right' style={shareStyle}>
        <button className='share-btn' onClick={toggle}>
          <svg xmlns="http://www.w3.org/2000/svg" role="img" width="22" height="22" viewBox="0 0 22 22">
            <path fillRule="evenodd" d="M12.444 13.5c-.82-.03-1.464-.716-1.444-1.537.02-.82.697-1.473 1.518-1.463.821.01 1.482.679 1.482 1.5-.016.844-.712 1.515-1.556 1.5zm0-6.5c-.82-.03-1.464-.716-1.444-1.537.02-.82.697-1.473 1.518-1.463C13.34 4.01 14 4.68 14 5.5c-.016.844-.712 1.515-1.556 1.5zm.112 10c.82.03 1.464.716 1.444 1.537-.02.82-.697 1.473-1.519 1.463-.82-.01-1.48-.679-1.481-1.5.017-.843.713-1.514 1.556-1.5z">
            </path>
          </svg>
        </button>
      </div>

      <Modal isOpen={modal} toggle={toggle} className='share-modal'>
        <ModalBody>
          <Container>
            <Col>
              <hr />
              <Row>
                <FacebookShareButton
                  className='ml-3'
                  url={`${url}`}
                  media={`${shareImage}`}
                >
                  <FacebookIcon
                    size={size}
                    iconFillColor={iconFillColor}
                    bgStyle={bgStyle}
                  />
                </FacebookShareButton>

                <TwitterShareButton
                  className='ml-5'
                  url={`${url}`}
                  title={title}
                >
                  <TwitterIcon
                    size={size}
                    iconFillColor={iconFillColor}
                    bgStyle={bgStyle}
                  />
                </TwitterShareButton>

                <WhatsappShareButton
                  className='ml-5'
                  url={`${url}`}
                  title={title}
                  separator=":: "
                >
                  <WhatsappIcon
                    size={size}
                    iconFillColor={iconFillColor}
                    bgStyle={bgStyle}
                  />
                </WhatsappShareButton>

                <LinkedinShareButton
                  className='ml-5'
                  url={`${url}`}
                  title={title}
                  windowWidth={750}
                  windowHeight={600}
                >
                  <LinkedinIcon
                    size={size}
                    iconFillColor={iconFillColor}
                    bgStyle={bgStyle}
                  />
                </LinkedinShareButton>

                <PinterestShareButton
                  className='ml-5'
                  url={`${url}`}
                  media={`${shareImage}`}
                  windowWidth={1000}
                  windowHeight={730}
                >
                  <PinterestIcon
                    size={size}
                    iconFillColor={iconFillColor}
                    bgStyle={bgStyle}
                  />
                </PinterestShareButton>
              </Row>
              <hr />
            </Col>
          </Container>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

const shareStyle = {
  textAlign: 'right'
}