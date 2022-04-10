// import { Modal } from '@mui/material'
// import React, { useState } from 'react'
// import ReactModal from 'react-modal'
// import '../App.css'
// // import Modal from 'react-M'
// ReactModal.setAppElement('#root')
// export default function Newmodal(props) {
//     const [modalOpen, setModalOpen] = useState(false)
//     return (
//         <>
// {/* 
//             <button className='btn btn-primary' onClick={() => setModalOpen(true)}>{props.title}</button>
//             <ReactModal className="text-center my-5 py-5" style={{
//                 overlay: {
//                     backgroundColor: 'grey'
//                 },
//                 content: {
//                     backgroundColor: 'white',
//                     // top: '100%',
//                     // left: 'auto',
//                     // right: '30%',
//                     // bottom: 'auto',
//                     marginRight: '10%',
//                     marginLeft: '300px'
//                     // transform: 'translate(-50%, -50%)',
//                 }
//             }} isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
//                 <h1>Enter Details</h1>
//                 <div className="container">


//                     <div class=" mb-3 d-flex justify-content-center align-items-center">
//                         <label for="exampleFormControlInput1" class="form-label">Email address</label>
//                         <input style={{ width: 'auto' }} type="email" class="form-control " id="exampleFormControlInput1" placeholder="name@example.com" />
//                     </div>
//                     <div class="mb-3">
//                         <label for="exampleFormControlTextarea1" class="form-label">Example textarea</label>
//                         <textarea style={{ width: 'auto' }} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
//                     </div>
//                 </div>
//                 <div>
//                     <button onClick={() => setModalOpen(false)} className='btn btn-secondary'>Close</button>
//                 </div>
//             </ReactModal > */}


//         </ >
//     )
// }
import React, { useState } from "react";
import "./Modal.css";

function Newmodal(props) {
    const [modalOpen, setModalOpen] = useState(false);

    return (<>
        <button
            className="openModalBtn"
            onClick={() => {
                setModalOpen(true);
            }}
        >
            {props.title}
        </button>
        {
            modalOpen &&

            <div className="modalBackground">
                <div className="modalContainer">
                    <div className="titleCloseBtn">
                        <button
                            onClick={() => {
                                setModalOpen(false);
                            }}
                        >
                            X
                        </button>
                    </div>
                    <div className="title">
                        <h1>Are You Sure You Want to Continue?</h1>
                    </div>
                    <div className="body">
                        <p>The next page looks amazing. Hope you want to go there!</p>
                    </div>
                    <div className="footer">
                        <button
                            onClick={() => {
                                setModalOpen(false);
                            }}
                            id="cancelBtn"
                        >
                            Cancel
                        </button>
                        <button>Continue</button>
                    </div>
                </div>
            </div>}</>
    );
}

export default Newmodal;