import axios from "axios";
import { useEffect, useState } from "react";
import "./Trending.css";
import SingleContent from "../../components/SingleContent/SingleContent";
import CustomPagination from "../../components/Pagination/CustomPagination";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const Trending = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);

  const fetchTrending = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.REACT_APP_API_KEY}&page=${page}`
    );

    setContent(data.results);
  };

  useEffect(() => {
    window.scroll(0, 0);
    setTimeout(() =>
      setLoading(false),
      3000
    )
    fetchTrending();
    // eslint-disable-next-line
  }, [page]);

  return (
    <div>
      {loading ?
        <Backdrop className={classes.backdrop} open>
          <CircularProgress color="inherit" />
        </Backdrop>
        :
        <div>
          <span className="pageTitle">Trending Today</span>
          <div className="trending">
            {content &&
              content.map((c) => (
                <SingleContent
                  key={c.id}
                  id={c.id}
                  poster={c.poster_path}
                  title={c.title || c.name}
                  date={c.first_air_date || c.release_date}
                  media_type={c.media_type}
                  vote_average={c.vote_average}
                />
              ))}
          </div>
          <CustomPagination setPage={setPage} />
        </div>
      }
    </div>

  );
};

export default Trending;
