import { useReducer, useContext, useEffect, useState } from "react";
import axios from "../../config/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import APIMethod from "../../components/APImethod";

function loginReducer(state, action) {
    switch (action.type) {
        case "field":
            return {
                ...state,
                [action.name]: action.value,
            };
        case "login":
            return {
                ...state,
                loading: true,
                error: null,
            };
        case "loginSuccess":
            return {
                ...state,
                loading: false,
                error: null,
            };
        case "loginFail":
            return {
                ...state,
                loading: false,
                password: "",
                error: action.error,
            };
        default:
            return state;
    }
}

const LoginPage = () => {
    const { user, setUser, setTodos } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };
    const [apiMethod, setApiMethod] = useState('');
    const [showLogin, setshowLogin] = useState(false);

    const [state, dispatch] = useReducer(loginReducer, {
        email: "",
        password: "",
        shouldRemember: true,
        loading: false,
        error: "",
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
        dispatch({ type: "login" });
        axios
            .post("/auth/login", {
                email: state.email,
                password: state.password,
            })
            .then((response) => {
                dispatch({ type: "loginSuccess" });
                if (response.user.todos) {
                    setTodos(response.user.todos);
                    response.user.todos = undefined;
                }
                setUser({
                    ...response.user,
                    token: response.token,
                });
                if (state.shouldRemember) {
                    localStorage.setItem("token", response.token);
                }
                navigate(from, { replace: true });
            })
            .catch((err) => {
                dispatch({ type: "loginFail", error: err.message });
            });
    };

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            navigate("/", { replace: true });
        }
    }, []);

    return (
    <div className="flex-grow" style={{ backgroundImage: "linear-gradient(45deg, #93a5cf 0%, #e4efe9 100%)" }}>
        <div className="flex min-h-[80vh] items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
            {!showLogin ? (
                // Render API method selection first
                <APIMethod apiMethod={apiMethod} handleApiSelection={handleApiSelection} handleLogin={handleLogin}/>
                ) : (
                    // Render login form if API method is selected
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Login to your account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Or{" "}
                            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Create a new account
                            </Link>
                        </p>
                        <form className="mt-8 space-y-6" method="POST" onSubmit={formSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        onChange={(e) =>
                                            dispatch({
                                                type: "field",
                                                name: "email",
                                                value: e.target.value,
                                            })
                                        }
                                        value={state.email}
                                        required
                                        className="appearance-none rounded-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        minLength={6}
                                        maxLength={30}
                                        onChange={(e) =>
                                            dispatch({
                                                type: "field",
                                                name: "password",
                                                value: e.target.value,
                                            })
                                        }
                                        value={state.password}
                                        required
                                        className="appearance-none rounded-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        onChange={(e) =>
                                            dispatch({
                                                type: "field",
                                                name: "shouldRemember",
                                                value: e.target.checked,
                                            })
                                        }
                                        checked={state.shouldRemember}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                                    disabled={state.loading}
                                >
                                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                        <svg
                                            className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </span>
                                    {state.loading ? "Loading..." : "Sign in"}
                                </button>

                                {state.error && (
                                    <div className="mt-4 text-red-600 text-center text-sm">
                                        {state.error.split('"').join("")}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    </div>
    );
};

export default LoginPage;
