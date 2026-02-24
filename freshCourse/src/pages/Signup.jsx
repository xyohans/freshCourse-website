import {Link} from 'react-router-dom'
// import styles from "../styles/signup.module.css"


function SignUp(){
    return(
        <div>
            <p>Sign up</p>
            <form>
                <input type="text" placeholder="First Name" />
                <input type="text" placeholder="Last Name" />
                <input type="email" placeholder="Email" />
                <input type="text" placeholder="Phone" />
                <input type="password" placeholder="Password" />
                <input type="password" placeholder="Confirm Password" />
                <button>sign up</button>
            </form>
            <p>Already have an account?<Link to="/login">login</Link></p>
        </div>
    )
}
export default SignUp