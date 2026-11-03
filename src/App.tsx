import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { ListPage } from './pages/ListPage';
import { DetailPage } from './pages/DetailPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<ListPage />} />
              <Route path="/item/:id" element={<DetailPage />} />
            </Routes>
          </main>
          <footer className="border-t border-gray-200 dark:border-gray-800 mt-12 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Công thức nấu ăn · MSSV 6651071060 · Dữ liệu từ{' '}
              <a
                href="https://www.themealdb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                TheMealDB
              </a>
            </p>
          </footer>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
