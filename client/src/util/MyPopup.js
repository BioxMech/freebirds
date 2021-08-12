import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Typography from '@material-ui/core/Typography';

function MyPopup({ content, children, placement="bottom" }) {

  return (
    <Tooltip 
      title={
        <Typography variant="body2">
          { content }
        </Typography>
      } 
      TransitionComponent={Zoom} 
      TransitionProps={{ timeout: 300 }} 
      arrow
      placement={placement}
    >
      { children }
    </Tooltip>
  )
}

export default MyPopup;