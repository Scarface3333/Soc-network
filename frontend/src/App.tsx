import {Button, Switch} from "@nextui-org/react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { UserProfile } from "./components/user-profile";

const App = () => {
  return (
//     <Router>
//     <Switch>
//         <Route path="/user/:id" Component={UserProfile} />
//         {/* Другие маршруты */}
//     </Switch>
// </Router>
    <div>
     <Button color="primary">
      Button
    </Button>
    </div>
  )
}

export default App
