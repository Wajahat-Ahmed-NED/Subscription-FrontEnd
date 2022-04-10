// import React from 'react'

// export default function Modall(props) {
//     return (
//         <>
//             <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
//                 {props.btnTitle}
//             </button>

//             {/* <!-- Modal --> */}
//             <div class="modal  my-5" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//                 <div class="modal-dialog">
//                     <div class="modal-content">
//                         <div class="modal-header">
//                             <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
//                             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <div class="modal-body">
//                             ...
//                         </div>
//                         <div class="modal-footer">
//                             <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//                             <button type="button" class="btn btn-primary">Save changes</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </>
//     )
// }
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { WebEdit } from './webeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { makeStyles } from '@material-ui/core';
import './webeditor.css';
import axios from 'axios';
// import { text } from './webeditor'
import AddIcon from '@mui/icons-material/Add';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 420,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflow: 'scroll',
    display: 'block',
    height: 500,
    // borderRadius: 8
};
const newstyle = {

    zIndex: 10,
    position: 'absolute',
}
const web = {
    width: '100 ',
}

export default function Modall(props) {
    const [open, setOpen] = React.useState(false);
    const [val, setVal] = React.useState('');
    const [arr, setArr] = React.useState([]);
    const [load, setLoad] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);

    }
    const handleClose = async (e) => {
        setOpen(false)
        // props.onClick()
        e.preventDefault()
        let obj = {
            PKOrderID: e.iD,
            Notes: e.notes,
            Total: e.total,
            CreatedDateTime: e.cDate,
            Description: e.desc,
            Status: e.status,
        }
        // https://api.idirecttest.com/admin/createTest
        const adminToken = localStorage.getItem("admin");
        const token = JSON.parse(adminToken)?.tokens?.accessToken;
        if (props.btnTitle === "Add") {


            await axios.post(`http://${process.env.REACT_APP_URL}/admin/createTest`, obj,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            ).then(function (response) {
                console.log(response, "asdfasdfasdf")
            }).catch(err => console.log(err, "this error founnd"))
        }
        else {
            console.log('edit hgoia')
            await axios.post(`http://${process.env.REACT_APP_URL}/admin/createTest`, obj,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            ).then(function (response) {
                console.log(response, "asdfasdfasdf")
            }).catch(err => console.log(err, "this error founnd"))

        }
        console.log(obj)

    };
    const useStyles = makeStyles({
        field: {
            display: 'block',
            width: 200,
        }
    })
    const classes = useStyles()
    // CKEditor.config.width=500,
    // console.log(text)

    const [iD, setID] = React.useState(0)
    const [notes, setNotes] = React.useState('')
    // const [notes, setNotes] = React.useState('')
    const [total, setTotal] = React.useState('')
    const [cDate, setCDate] = React.useState('')
    const [desc, setDesc] = React.useState('')
    const [status, setStatus] = React.useState('')
    // let arr = []
    // console.log(iD)
    console.log(notes)
    console.log(total)
    console.log(cDate)
    console.log(desc)
    console.log(status)
    // console.log(text)
    const handleChange = (e) => {
        // setVal(e)
        e.preventDefault()
        let obj = {
            // PKOrderID: e.iD,
            Notes: e.notes,
            Total: e.total,
            CreatedDateTime: e.cDate,
            Description: e.desc,
            Status: e.status,
        }

        console.log(obj)

        // setArr([val])
        // arr.push(val)
        // console.log(val)
        // console.log(e.target.value)

    }
    console.log(val)
    return (
        <>

            {
                props.btnTitle === "Add" ? <Button className="ms-auto me-3 my-5" onClick={handleOpen} size='large' style={{ backgroundColor: 'darkCyan' }} variant="contained">Create User<AddIcon /></Button> :
                    <Button onClick={handleOpen} size='large' style={{ width: '20px' }}>{props.btnTitle === "Edit" ? <EditIcon color='warning' /> : <DeleteIcon color='error' />}</Button>
            }

            {props.btnTitle === "Edit" || props.btnTitle === "Add" ? <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>

                    <Typography style={newstyle} id="modal-modal-title" variant="h6" component="h2">
                        <span >{props.btnTitle === "Add" ? "Add Details" : "Edit Details"}</span>
                    </Typography>
                    <Typography style={newstyle} id="modal-modal-description" sx={{ mt: 2 }}>
                        <form onSubmit={(e) => handleClose(e)}>




                            <div >



                                <div class="my-3">
                                    <label for="exampleInputEmail1" class="form-label">OrderID</label>
                                    <input style={{ width: '380px' }} class="form-control" value={props.id} />
                                </div>
                                <div class="my-3">
                                    <label class="form-label">Notes</label>
                                    <input style={{ width: '380px' }} onChange={(e) => setNotes(e.target.value)} class="form-control" />
                                </div>
                                <div class="my-3">
                                    <label class="form-label">Total</label>
                                    <input style={{ width: '380px' }} type="number" class="form-control" onChange={(e) => setTotal(e.target.value)} />
                                </div>
                                <div class="my-3">
                                    <label class="form-label">Created Date</label>
                                    <input style={{ width: '380px' }} type="date" onChange={(e) => setCDate(e.target.value)} class="form-control" />
                                </div>
                                <div class="my-3">
                                    <label class="form-label">Description</label>
                                    {/* <WebEdit style={{ width: '380px' }} class="form-control"

                                    /> */}
                                    <div className={classes.field} >

                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={desc}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                setDesc(data);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div class="my-3">
                                    <label class="form-label">Status</label>
                                    <select style={{ width: '380px' }} class="form-control" onChange={(e) => setStatus(e.target.value)}>
                                        <option selected >Enabled</option>
                                        <option>Disabled</option>
                                    </select>
                                </div>




                                <Button className="ms-auto me-3 my-3" onClick={handleClose} size='small' style={{ backgroundColor: 'darkCyan' }} variant="contained">{props.btnTitle === "Add" ? "Add " : "Update "}</Button>

                            </div>
                        </form>
                    </Typography>
                </Box>
            </Modal> :
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"

                >
                    <Box sx={style} style={{ height: '40px', overflow: 'hidden' }}>
                        <Typography id="modal-modal-title" className="text-center" variant="h6" component="h2">
                            Deleted Successfully
                        </Typography>
                        {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        </Typography> */}
                    </Box>
                </Modal>}
        </>
    );
}