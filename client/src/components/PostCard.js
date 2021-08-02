import React, { useContext } from 'react';
import { Card, Label, Icon, Image, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { AuthContext } from '../context/auth';

import MyPopup from '../util/MyPopup';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';

function PostCard({ post: { body, createdAt, id, username, likeCount, commentCount, likes }}) {
  
  const { user } = useContext(AuthContext);
  
  return (
    <Card fluid>
      <Card.Content>
        {/* TODO: Add an info popup to tell when the user signed up */}
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{ username }</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{ moment(createdAt).fromNow() }</Card.Meta>
        <Card.Description>
          { body }
        </Card.Description>
      </Card.Content>

      <Card.Content extra>
        {/* Like Button */}
        <LikeButton user={ user } post={{ id, likes, likeCount }} />
        <MyPopup
          content='Comment on post'
        >
          <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
            <Button color='blue' basic>
              <Icon name='comments' />
            </Button>
            <Label basic color='blue' pointing='left'>
              { commentCount }
            </Label>
          </Button>
        </MyPopup>       
      { user && user.username === username && <DeleteButton postId={id} /> } 
      {/* && - if all of these are true */}

      </Card.Content>
    </Card>
  )
}

export default PostCard