import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/global.css'
import { store } from '../redux/store'
import { Provider } from 'react-redux'

function MyApp({ Component, pageProps }: AppProps) {
  return <Provider store={store}>
  <Component {...pageProps} />
  </Provider>
  
}

export default MyApp
