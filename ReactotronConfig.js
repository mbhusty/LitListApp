import Reactotron from "reactotron-react-native";
import { reactotronRedux } from 'reactotron-redux'
const reactotron = Reactotron
  .configure({ name: 'LitList App' })
  .use(reactotronRedux())
  .connect()
export default reactotron
