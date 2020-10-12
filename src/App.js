import React from 'react';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import ShareIcon from '@material-ui/icons/Share';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Badge from '@material-ui/core/Badge';

import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';
import indigo from '@material-ui/core/colors/indigo';
import blue from '@material-ui/core/colors/blue';
import teal from '@material-ui/core/colors/teal';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import yellow from '@material-ui/core/colors/yellow';

import { LoremIpsum } from "lorem-ipsum";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const PRIM_COLORS = [pink, indigo, teal, amber];
const SECO_COLORS = [red, blue, green, yellow];
const COLOR_IDX = Math.floor(Math.random() * PRIM_COLORS.length);

const SELECTED_THEME = createMuiTheme({
  palette: {
    primary: PRIM_COLORS[COLOR_IDX],
    secondary: SECO_COLORS[COLOR_IDX],
  },
});

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

const PAGE_TITLE = 'Product Catalog';
const PAGE_CONTENT = 'This is an example how React JS renders a catalog webpage.' + 
                    ' All contents are random for display only.' 
const CARDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const PRODUCT_ITEMS = CARDS.map((card) => {
  return {
    id: card
    , thumbnail: 'https://source.unsplash.com/random?sig='+ card
    , header: lorem.generateWords(5)
    , content: lorem.generateSentences(2)
  }
});
const FOOTER = lorem.generateWords(5);
const SUB_FOOTER = lorem.generateSentences(2);

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/tekichan">
        Teki Chan
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function DetailDialog(props) {
  const classes = useStyles();
  const { open, onClose, thumbnail, header, content } = props;
  const handleClose = (_event) => { onClose(_event); }
  return (
<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
  <DialogTitle id="simple-dialog-title">{header}</DialogTitle>
  <Card className={classes.card}>
    <CardMedia className={classes.cardMedia} image={thumbnail} title={header} />
    <CardContent className={classes.cardContent}>
      <Typography>{content}</Typography>
    </CardContent>
  </Card>
</Dialog>
  );
}

export default function App() {
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = React.useState('');
  const [selectedHeader, setSelectedHeader] = React.useState('');
  const [selectedContent, setSelectedContent] = React.useState('');
  const [mainCount, setMainCount] = React.useState(0);
  const [nextCount, setNextCount] = React.useState(0);

  const handleOpenDialog = (thumbnail, header, content) => {
    setSelectedThumbnail(thumbnail);
    setSelectedHeader(header);
    setSelectedContent(content);
    setDialogOpen(true);
  };

  const handleShareButton = (header, content) => {
    if (navigator.share) {
      navigator
        .share({
          title: header,
          text: content,
          url: document.location.href,
        })
        .then(() => {
          console.log('Successfully shared');
        })
        .catch(error => {
          alert('Something went wrong sharing the blog', error);
          window.location.reload(); // now share works again
        });
    } else {
      alert('navigator.share is not supported.');
    }
    return false;    
  }
    
  const classes = useStyles();

  return (
    <React.Fragment>
      <ThemeProvider theme={SELECTED_THEME}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <ShoppingCartIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            {PAGE_TITLE}
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              {PAGE_TITLE}
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              {PAGE_CONTENT}
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Badge badgeContent={mainCount} color="secondary"><Button variant="contained" color="primary" onClick={(_event) => { setMainCount(mainCount + 1); }}>
                    Main call to action
                  </Button></Badge>
                </Grid>
                <Grid item>
                  <Badge badgeContent={nextCount} color="primary"><Button variant="outlined" color="primary" onClick={(_event) => { setNextCount(nextCount + 1); }}>
                    Secondary action
                  </Button></Badge>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {PRODUCT_ITEMS.map((item) => (
              <Grid item key={item.id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={item.thumbnail}
                    title={item.header}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {item.header}
                    </Typography>
                    <Typography>
                      {item.content}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" onClick={ (_event) => handleOpenDialog(item.thumbnail, item.header, item.content) }>
                      <FindInPageIcon className={classes.icon} />Detail
                    </Button>
                    <Button size="small" color="primary" onClick={ (_event) => handleShareButton(item.header, item.content) }>
                      <ShareIcon className={classes.icon} />Share
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            <DetailDialog thumbnail={selectedThumbnail} 
                          header={selectedHeader}  
                          content={selectedContent}
                          open={isDialogOpen}
                          onClose={ (_event) => { setDialogOpen(false);} } />
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          {FOOTER}
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          {SUB_FOOTER}
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
      </ThemeProvider>
    </React.Fragment>
  );
}
