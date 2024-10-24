const APIMethod = ({handleApiSelection,handleLogin, apiMethod}) => {
    return(
        <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
                Choose API Method
            </h2>
            <div className="mt-6">
                <div className="flex items-center space-x-4 my-4 justify-center">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="apiMethod"
                            value="java"
                            className="form-radio text-indigo-600 focus:ring-indigo-500"
                            onChange={handleApiSelection}
                        />
                        <span className="ml-2 text-sm text-gray-700">Java</span>
                    </label>

                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="apiMethod"
                            value="laravel"
                            className="form-radio text-indigo-600 focus:ring-indigo-500"
                            onChange={handleApiSelection}
                        />
                        <span className="ml-2 text-sm text-gray-700">Laravel</span>
                    </label>

                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="apiMethod"
                            value="node"
                            className="form-radio text-indigo-600 focus:ring-indigo-500"
                            onChange={handleApiSelection}
                        />
                        <span className="ml-2 text-sm text-gray-700">Node.js</span>
                    </label>
                </div>
                <button
                    type="submit"
                    className="group w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                    disabled={!apiMethod}
                    onClick={handleLogin}
                >
                    Proceed
                </button>
            </div>
        </div>
    )
}

export default APIMethod;
