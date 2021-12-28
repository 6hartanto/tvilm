import axios from "axios";
import {
  createTheme,
  Tab,
  Tabs,
  ThemeProvider,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import Genres from "../../components/Genres/Genres";
import CustomPagination from "../../components/Pagination/CustomPagination";
import SingleContent from "../../components/SingleContent/SingleContent";
import useGenre from "../../hooks/useGenre";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const darkTheme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#fff",
    },
  },
});

const Series = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const genreforURL = useGenre(selectedGenres);
  const [filter, setFilter] = useState(0);

  const fetchSeries = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/tv/${filter ? "top_rated" : "popular"}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreforURL}`
    );
    setContent(data.results);
    setNumOfPages(data.total_pages);
    // console.log(data);
  };

  useEffect(() => {
    window.scroll(0, 0);
    setTimeout(() =>
      setLoading(false),
      3000
    )
    fetchSeries();
    // eslint-disable-next-line
  }, [genreforURL, filter, page]);

  return (
    <div>
      {loading ?
        <Backdrop className={classes.backdrop} open>
          <CircularProgress color="inherit" />
        </Backdrop>
        :
        <div>
          <ThemeProvider theme={darkTheme}>
            <span className="pageTitle">Discover Series</span>
            <Tabs
              value={filter}
              indicatorColor="primary"
              textColor="primary"
              onChange={(event, newValue) => {
                setFilter(newValue);
                setPage(1);
              }}
              style={{ paddingBottom: 5 }}
              aria-label="disabled tabs example"
            >
              <Tab style={{ width: "50%" }} label="Popular" />
              <Tab style={{ width: "50%" }} label="Top Rated" />
            </Tabs>
            <Genres
              type="tv"
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
              genres={genres}
              setGenres={setGenres}
              setPage={setPage}
            />
            <div className="trending">
              {content &&
                content.map((c) => (
                  <SingleContent
                    key={c.id}
                    id={c.id}
                    poster={c.poster_path}
                    title={c.title || c.name}
                    date={c.first_air_date || c.release_date}
                    media_type="tv"
                    vote_average={c.vote_average}
                  />
                ))}
            </div>
            {numOfPages > 1 && (
              <CustomPagination setPage={setPage} numOfPages={numOfPages} />
            )}
          </ThemeProvider>
        </div>
      }
    </div>

  );
};

export default Series;
