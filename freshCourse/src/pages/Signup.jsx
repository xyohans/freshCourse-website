import {Link} from 'react-router-dom'
// import styles from "../styles/signup.module.css"


function SignUp(){

    // fetch('')
    return(
        <div>
            <p>Sign up</p>
            <form method='post' action='/signup'>
                <input type="text" placeholder="First Name" />
                <input type="text" placeholder="Last Name" />
                <input type="email" placeholder="Email" />
                <span>+251</span>
                <input type="tel" name="phone" placeholder="9XXXXXXXX" pattern="[0-9]{9}" required />
                <input type="password" placeholder="Password" />
                <input type="password" placeholder="Confirm Password" />
                <Link to='/verification' ><button>sign up</button></Link>
            </form>
            <p>Already have an account?<Link to="/login">login</Link></p>
        </div>
    )
}
export default SignUp