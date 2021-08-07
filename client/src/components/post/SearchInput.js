import React, { Fragment } from 'react'
const SearchInput = React.memo((props) => {

  return (
    <Fragment>
      <div style={inputSearchStyle}>
        <input className='input-place-holder form-control pt-3 pl-2' style={inputStyle} onChange={props.onChange} type="text" name='name' placeholder="Search" />
      </div>
    </Fragment>
  );
});
export default SearchInput;

const inputStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0)',
  border: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.411)',
  borderRadius: '1px',
  marginTop: '-9px',
};
const inputSearchStyle = {
  width: '55px',
  marginTop: '-3px'
}

