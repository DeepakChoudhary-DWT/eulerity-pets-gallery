import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { GlobalStyles } from '@/styles/GlobalStyles';
import { SelectionProvider } from '@/context/SelectionContext';
import { Layout } from '@/components/Layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { GalleryPage } from '@/pages/GalleryPage';
import { PetDetailPage } from '@/pages/PetDetailPage';
import { AboutPage } from '@/pages/AboutPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Top-level providers wrap the router so theme + selection are available
// everywhere, including inside route components.
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <SelectionProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="pets/:id" element={<PetDetailPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SelectionProvider>
    </ThemeProvider>
  );
}
