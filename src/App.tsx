import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ListProvider } from './context/ListContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Details } from './pages/Details';
import { Search } from './pages/Search';
import { MyList } from './pages/MyList';
import { Movies } from './pages/Movies';
import { TvShows } from './pages/TvShows';

export default function App() {
  return (
    <ThemeProvider>
      <ListProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tv" element={<TvShows />} />
              <Route path="/details/:type/:id" element={<Details />} />
              <Route path="/search" element={<Search />} />
              <Route path="/my-list" element={<MyList />} />
            </Routes>
          </Layout>
        </Router>
      </ListProvider>
    </ThemeProvider>
  );
}
