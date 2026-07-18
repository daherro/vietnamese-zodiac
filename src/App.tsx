import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './theme/app.css'
import { ComparePage } from './pages/ComparePage'
import { InputPage } from './pages/InputPage'
import { ResultPage } from './pages/ResultPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InputPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </BrowserRouter>
  )
}
