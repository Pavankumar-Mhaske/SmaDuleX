/**
 * @param  task - Denotes the purpose of the form (create Todo / update Todo).
 * @param  buttonName - Denotes the name of submitting button (Create Todo / Update Todo).
 * @param  todo - used to populate inital values if todo is passed.
 * @param  setMakeRequest - To make DB call and populate todos in todoList once form is submitted.
 * @returns - Form element - Which can be used to update or create a todo.
 */

const TodoForm = () => {
  return (
    <form className="flex flex-col w-[95%] sm:w-5/6 md:w-full m-auto bg-white">
      <div className="border-2 rounded border-violet-600 p-3 m-4 md:p-4 md:m-6 lg:m-0">
        <div className="w-full flex flex-col lg:flex-row p-0 lg:p-2 mb-4 lg:mb-0">
          <div className="w-full lg:w-1/2">
            <label
              htmlFor="isImportant"
              className=" block  mt-10 text-lg  md:text-xl  text-violet-800  font-medium"
            >
              <input
                className=" p-3  -mt-1  focus:ring-0  border-2  border-violet-800  text-violet-800"
                type="checkbox"
                name="isImportant"
                id="isImportant"
              />{" "}
              Highlight Todo
            </label>
          </div>
          <div className="w-full lg:w-1/2 mt-6 lg:mt-0"></div>
        </div>
      </div>
    </form>
  );
};
