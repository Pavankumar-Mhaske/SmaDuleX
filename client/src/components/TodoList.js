const TodoList = () => {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between my-4 w-full sm:w-2/3 m-auto">
        <button
          className="border border-red-700 rounded p-2 ml-6 sm:ml-3 md:p-3 my-4 lg:my-0"
          type="button"
        >
          <img src={closeIcon} alt="cancel search" width="20" />
        </button>

        <div></div>

        <div className="order-2 ml-6 sm:ml-2 my-4 lg:order-none md:ml-0">
          <label htmlFor="sort">
            <span className="font-medium text-violet-800">Sort by: </span>
            <select
              defaultValue="isImportant"
              className="border-violet-500 rounded text-violet-800 font-semibold py-0.5"
            >
              <option value="isImportant" className="px-2">
                Priority
              </option>
              <option value="isCompleted" className="px-2">
                Completed
              </option>
              <option value="createdAt" className="px-2">
                Created Date
              </option>
              <option value="updatedAt" className="px-2">
                Updated Date
              </option>
              <option value="title" className="px-2">
                Alphabetical
              </option>
            </select>
          </label>
        </div>
        <div className="flex items-center w-full mx-5 sm:mx-2 lg:mx-3 lg:w-7/12 lg:mx-0 xl:w-5/12">
          <input
            type="text"
            name="search"
            id="search"
            required
            placeholder="Search for your todos / tasks"
            className="
                    w-full 
                    border-r-transparent 
                    border-violet-700 
                    rounded-l
                    text-sm 
                    lg:text-lg 
                    placeholder-violet-700 
                    leading-4
                    lg:leading-7 
                    py-2 
                    text-violet-800 
                    font-medium 
                    outline-none 
                    focus:ring-0
                "
          />
          <button
            className="
                    border 
                    border-violet-700 
                    rounded-r
                    p-[5.3px]
                    lg:p-3
                "
            type="button"
            onClick={(e) => handleSearch(e)}
          >
            <img src={searchIcon} alt="search button" />
          </button>
        </div>
      </div>
      <div className="border-2 w-[95%] sm:w-2/3 mx-auto mb-12 pr-2 pb-1 rounded">
        <p className="text-2xl font-semibold text-violet-800 text-center p-2">
          Your have no todos left...!
        </p>

        <p className="text-sm md:text-2xl font-semibold text-violet-800 text-center p-2">
          No todos or tasks available with respect to your search
        </p>
      </div>
    </>
  );
};

export default TodoList;
