import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardCustom } from './CardItemClass';


 const CardItem : React.FC<CardCustom> =({
    sMaxWidth,imageG,height,children,Actionbuttom,onClick
 }) => {
  return (
    <Card sx={{ maxWidth: sMaxWidth }} onClick={onClick}>
      <CardMedia
        sx={{ height: height }}
        image={imageG}
        title="image"
      />
      <CardContent>
       {children}
      </CardContent>
      <CardActions>
       {Actionbuttom}
      </CardActions>
    </Card>
  );
}

export default CardItem