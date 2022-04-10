import React, { Component, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { makeStyles } from '@material-ui/core';
import './webeditor.css';

// export const text;


export function WebEdit(props) {
    const [text, setText] = useState('')

    const useStyles = makeStyles({
        field: {
            display: 'block',
            width: 600,
            // margin: 0,
        }
    })
    const classes = useStyles()
    // CKEditor.config.width=500,
    console.log(text)

    return (
        <div className={classes.field} >

            <CKEditor
                editor={ClassicEditor}
                data={text}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setText(data);
                }}
            />
        </div>
    );

}

// export default webEditor;
