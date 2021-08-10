import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Grid, ButtonGroup, Button } from '@material-ui/core';


const HomePage: FC = (): JSX.Element => {
  return (
    <Grid container
      direction='column'
      alignItems='center'
      justifyContent='center'
      style={{ minHeight: '90vh' }}
      spacing={3}
    >
      <Grid item xs={12}>
        <ButtonGroup disableElevation
          variant='contained'
        >
          <Button
            color='default'
            component={Link}
            to='/about'
          >
            About
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}


export default HomePage;