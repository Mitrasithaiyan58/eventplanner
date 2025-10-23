import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EventList from './components/EventList';
import AddEvent from './components/AddEvent';
import EditEvent from './components/EditEvent';
import UserList from './components/UserList';
import AddUser from './components/AddUser';
import EditUser from './components/EditUser';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/users" />} />

        {/* User Routes */}
        <Route path="/users" element={<UserList />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/edit-user/:id" element={<EditUser />} />

        {/* Event Routes */}
        <Route path="/events" element={<EventList />} />
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/edit-event/:id" element={<EditEvent />} />

        {/* Catch all - optional */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
