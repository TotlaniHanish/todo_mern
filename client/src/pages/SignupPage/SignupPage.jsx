import { useContext, useEffect, useState} from "react";
import axios from "../../config/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import { toast } from 'react-hot-toast';
import APIMethod from "../../components/APImethod";


const SignupPage = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };
    const [apiMethod, setApiMethod] = useState('');
    const [showLogin, setshowLogin] = useState(false);
    const [state, setState] = useState({
        email: "",
        password: "",
        username: "",
    });

    const handleApiSelection = (e) => {
        setApiMethod(e.target.value);
        window.localStorage.setItem('method',e.target.value)
    };
    const handleLogin = (e) => {
        setshowLogin(true);
    };
    const formSubmit = (e) => {
        e.preventDefault();

        axios
            .post("/auth/signup", {
                email: state.email,
                password: state.password,
                username: state.username,
            })
            .then((res) => {
                if (res.user){
                    setUser({
                        ...res.user,
                        todos: undefined,
                        token: res.token,
                    });
                    localStorage.setItem("token", res.token);
                }
                navigate(from, { replace: true });
            })
            .catch((err) => {
                console.log("Failed to sign up:", err);
                if(err.code){
                    toast.error(err.message);
                }else{
                    toast.error("Failed to sign up");
                }
            });
    };

    useEffect(() => {
        if (user) {
            navigate("/", { replace: true });
        }
    }, []);

    return (
        <div className="flex-grow" style={{ backgroundImage: "linear-gradient(45deg, #93a5cf 0%, #e4efe9 100%)" }}>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-lg">
                {!showLogin ? (
                // Render API method selection first
                <APIMethod apiMethod={apiMethod} handleApiSelection={handleApiSelection} handleLogin={handleLogin}/>
                ) : (
                    <>
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Signup
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Already have an account?
                            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                                Login
                            </Link>
                        </p>
                    </div>

                    <div className="mt-5 md:col-span-2 md:mt-0">
                        <form method="POST" onSubmit={formSubmit}>
                            <div className="overflow-hidden">
                                <div className="px-4 pt-5 sm:px-6">
                                    <div className="grid grid-cols-6 gap-6">
                                        <div className="col-span-6">
                                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                autoComplete="username"
                                                className="appearance-none rounded-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Username"
                                                onChange={(e) =>
                                                    setState({
                                                        ...state,
                                                        username: e.target.value,
                                                    })
                                                }
                                                required
                                                value={state.username}
                                            />
                                        </div>

                                        <div className="col-span-6">
                                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                                Email address
                                            </label>
                                            <input
                                                type="text"
                                                name="email-address"
                                                autoComplete="email"
                                                className="appearance-none rounded-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Email address"
                                                required
                                                onChange={(e) =>
                                                    setState({
                                                        ...state,
                                                        email: e.target.value,
                                                    })
                                                }
                                                value={state.email}
                                            />
                                        </div>
                                        <div className="col-span-6">
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                id="password"
                                                className="appearance-none rounded-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Password"
                                                required
                                                minLength={6}
                                                maxLength={30}
                                                onChange={(e) =>
                                                    setState({
                                                        ...state,
                                                        password: e.target.value,
                                                    })
                                                }
                                                value={state.password}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="group relative mt-6 mb-2 flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                                focus:ring-offset-2 disabled:bg-blue-900 disabled:text-gray-200"
                                        disabled={state.loading}
                                    >
                                        {state.loading ? "Loading..." : "Signup"}
                                    </button>
                                </div>

                                {state.error && (
                                    <div className="px-4 py-3 text-sm uppercase text-red-600 sm:px-6">
                                        {state.error.split('"').join("")}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                    </>

                )}
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
