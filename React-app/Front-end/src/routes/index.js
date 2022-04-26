import {Routes,Route,Navigate} from "react-router-dom";
import { HomePage,AuthPage,SinglePage,SpotifyCallback} from "all";

function PrivateRoute({ children }) {
    const authed = localStorage.getItem('isAuth')
    return authed ? children : <Navigate to="/login" />;
}
  

export default function routes() {
    return (
        <Routes>
            <Route path="/login" element={<AuthPage type="login"/>}/>
            <Route path="/register" element={<AuthPage type="register"/>}/>

            <Route path="/" element={<PrivateRoute><HomePage/></PrivateRoute>}/>
            <Route path="/songs" element={<PrivateRoute><SinglePage type="songs"/></PrivateRoute>}/>
            {/* <Route path="/top" element={<PrivateRoute><SinglePage type="top"/></PrivateRoute>}/> */}
            <Route path="/recommendations" element={<PrivateRoute><SinglePage type="recommendations"/></PrivateRoute>}/>
            {/* <Route path="/albums" element={<PrivateRoute><SinglePage type="albums"/></PrivateRoute>}/> */}
            {/* <Route path="/artists" element={<PrivateRoute><SinglePage type="artists"/></PrivateRoute>}/> */}
            <Route path="/playlist" element={<PrivateRoute><SinglePage type="playlist"/></PrivateRoute>}/>
            <Route path="/callback" element={<PrivateRoute><SpotifyCallback/></PrivateRoute>}/>
        </Routes>
    );
}