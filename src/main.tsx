import App from './App'
import { mount } from './mount'
import './index.css'

mount(<App path={window.location.pathname} />)
