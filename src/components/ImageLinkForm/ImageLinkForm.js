import React from 'react'
import './imageLinkForm.css'

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
    return (
        <form onSubmit={onButtonSubmit}>
            <p className='f3'>
                {'This Magic Brain will detect faces in your pictures. Give it a try.'}
            </p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-2'>``
                    <input type="text" className='f4 pa2 w-70 center' onChange={onInputChange} required/>
                    <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' type='submit'>Detect</button>
                </div>
            </div>
        </form>
    )
}

export default ImageLinkForm
