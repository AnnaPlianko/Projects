import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from './Components/LayoutArea/Layout/Layout'
import { Provider } from 'react-redux'
import { store } from './Redux/Store'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>

      <Provider store={store}>
        <Layout />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
