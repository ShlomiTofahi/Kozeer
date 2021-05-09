import React, { Fragment, useState, useEffect } from 'react';
import { Prompt } from 'react-router'
import { Button, Fade } from 'reactstrap';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import Message from './Message';
import Progress from './Progress';

var path = require('path');

const FileUpload = (props) => {
  var InitializedFilename = '';
  var InitializedFilepath = ''
  var InitializeduploadedFile = {}

  if (props.currImage) {
    InitializedFilename = path.basename(props.currImage);
    InitializedFilepath = props.currImage;
    InitializeduploadedFile = { fileName: path.basename(props.currImage), filePath: props.currImage }
  }

  if (props.currImage)
    InitializedFilename = path.basename(props.currImage);

  const [file, setFile] = useState('');
  const [filename, setFilename] = useState(InitializedFilename);
  const [filepath, setFilepath] = useState(InitializedFilepath);
  const [uploadedFile, setUploadedFile] = useState(InitializeduploadedFile);
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [removeImagefadeIn, setRemoveImagefadeIn] = useState(false);
  const [removeOrginalImagefadeIn, setRemoveOrginalImagefadeIn] = useState(false);
  const [removedOrginalImage, setRemovedOrginalImage] = useState(false);
  const [imageSubmited, setImageSubmited] = useState(false);
  const [firstUploaded, setFirstUploaded] = useState(true);

  useEffect(() => {
    if (props.currImage) {
      const noImageFullpath = props.path + 'no-image.png';

      if (!removeImagefadeIn && props.currImage != noImageFullpath)
        setRemoveOrginalImagefadeIn(true);
      if (!filename) {
        setFilename(path.basename(props.currImage));
        setFilepath(props.currImage);
        setUploadedFile({ fileName: path.basename(props.currImage), filePath: props.currImage })

      }
    }
  });
  const onChangeFileUpload = event => {
    let file = event.target.files[0];
    if (file && file.type != "image/png" && file.type != 'image/jpg' && file.type != 'image/jpeg'
      && file.type != 'image/webp' && file.type != 'image/gif') {
      setMessage("File does not support. You must use .png or .jpg ");
      // return false;
    }
    else if (file && file.size > 5242880) {
      setMessage("Please upload a file smaller than 5 MB");
      //  return false;
    }
    else {
      setFile(file);
      setFilename(file.name.replace(/\s+/g, '_') + uuidv4());
    }
  };

  const onSubmitFileUpload = async e => {
    e.preventDefault();

    const noImageFullpath = props.path + 'no-image.png';
    if (!firstUploaded && filepath !== '' && filepath != noImageFullpath) {

      // (!props.currImage || props.currImage == noImageFullpath) && 
      const formData = new FormData();
      formData.append('filepath', filepath);
      formData.append('abspath', props.path);

      axios.post('/remove', formData);
    }
    setFirstUploaded(false);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename);
    formData.append('abspath', props.path);

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });

      const { fileName, filePath } = res.data;
      setFilepath(filePath);

      props.setRegisterModalStates(filePath);

      setUploadedFile({ fileName, filePath });

      setMessage('File Uploaded');

      if (removeImagefadeIn == false) {
        setRemoveImagefadeIn(!removeImagefadeIn);
        setRemoveOrginalImagefadeIn(false);
      }
      if (imageSubmited == false) {
        setImageSubmited(true)
      }

    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }

  };

  const removeImage = () => {

    const noImageFullpath = props.path + 'no-image.png';
    if (filepath != noImageFullpath) {
      const formData = new FormData();
      formData.append('filepath', filepath);
      formData.append('abspath', props.path);

      axios.post('/remove', formData);
      setMessage('התמונה נמחקה בהצלחה!')
      setImageSubmited(false)

      if (props.prevImage) {
        setFilepath(props.prevImage)
        props.setRegisterModalStates(props.prevImage);
        setFilename(path.basename(props.prevImage));
        setUploadedFile({ fileName: path.basename(props.prevImage), filePath: props.prevImage })
      }
      else {
        setFilepath('');
        setFilename('');
      }
      setFile('')
      setRemoveImagefadeIn(false)
    }
  }

  const removeOrginalImage = () => {
    const noImageFullpath = props.path + 'no-image.png';
    if (filepath != noImageFullpath) {
      const formData = new FormData();
      formData.append('filepath', filepath);
      formData.append('abspath', props.path);

      axios.post('/remove', formData);

      if (props.currImage) {
        const noImageFullpath = props.path + 'no-image.png';
        setFilepath(noImageFullpath)
        setFilename('no-image.png');

        setMessage('התמונה המקורית נמחקה בהצלחה!')
      }
      else {
        setFilepath('');
        setFilename('');
      }
      props.setRegisterModalStates(noImageFullpath);

      setFile('')
      setUploadedFile({ fileName: 'no-image.png', filePath: noImageFullpath })
      setRemoveImagefadeIn(false);
      setRemovedOrginalImage(true);

      if (props.removedOrginalItemImage) {
        props.removedOrginalItemImage();

      }
    }
  }

  return (
    <Fragment>
      <Prompt when={!props.imageSaved}
        message={() => {

          const noImageFullpath = props.path + 'no-image.png';
          // const filepath = this.state.petImage
          if (!props.imageSaved) {
            if (filepath !== '' && filepath !== noImageFullpath && filepath !== props.prevImage) {
              const formData = new FormData();
              formData.append('filepath', filepath);
              axios.post('/remove', formData);
            }
            if (removedOrginalImage) {
              props.removedOrginalImageAndNotSave()
            }
          }
        }}
      />
      
      {message ? <Message msg={message} /> : null}
      
      <form>
        <div className='custom-file mb-4'>
          <input
            type='file'
            accept="image/*"
            className='custom-file-input'
            id='customFile'
            onChange={onChangeFileUpload}
          />
          <label align="left" className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>

        <Progress percentage={uploadPercentage} />

        <Button
          value='Upload'
          size='sm'
          onClick={onSubmitFileUpload}
          style={{ marginTop: '2rem' }}
        >העלאה
        </Button>
      </form>

      <Fade in={removeOrginalImagefadeIn} tag="h5" className="mt-3">
        <Button
          color='danger'
          size='sm'
          onClick={removeOrginalImage}
        >מחק תמונה מקורית</Button>
      </Fade>
      {uploadedFile ? (
        <div className='row mt-5' style={{ maxWidth: '506px' }}>
          <div className='col-md-6 m-auto'>
            <small className='text-center'>{uploadedFile.fileName}</small>
            <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
          </div>
        </div>
      ) : null}

      <Fade in={removeImagefadeIn} tag="h5" className="mt-3">
        <Button
          color='light'
          size='sm'
          onClick={removeImage}
        >מחק תמונה</Button>
      </Fade>
    </Fragment>
  );
};

export default FileUpload;
