import React from 'react'
import ReactDOM from 'react-dom/client'
import { ShowcaseExample } from '../examples/showcase'
import './style.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ShowcaseExample />
  </React.StrictMode>,
)