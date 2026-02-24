import { Link } from "react-router-dom"


function Login(){
    return(
        <div>
            <p>Sign up</p>
            <form>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button>Login</button>
            </form>
            <p>Don't have an account?<Link to="/">sign up</Link></p>
        </div>
    )
}
export default Login