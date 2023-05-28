import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

const Note = ({ note }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5">
                    {note.title}
                </Typography>
                <Typography variant="body1">
                    {note.body}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Note;
