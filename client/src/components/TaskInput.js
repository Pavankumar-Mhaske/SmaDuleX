/**
 *
 * @param tasks - Array (State).
 * @param setTasks - Function (Update State).  To handle add task operation
 * @returns Task Collection and Task Input Element.
 */

const TaskInput = () => {
  return (
    <>
      <div className="h-24 md:h-48 border-2 rounded mb-4 py-1 md:py-2">
        <div className="mb-6 min-h-fit max-h-20 md:max-h-44 overflow-auto flex flex-wrap">
          <h1 className="   text-[24px] sm:text-[30px] md:text-[42px] font-bold text-violet-400 pl-6">
            Add your tasks below
          </h1>
        </div>
      </div>
      <div className="w-1/2 inline">
        <label htmlFor="taskInput">
          <input
            className=" pb-1  pl-2  border-t-0 border-l-0 border-r-0 border-b-2 border-violet-400 focus:border-violet-800  focus:outline-none  text-md md:text-lg w-full  sm:w-[70%] lg:w-[60%]  xl:w-2/3 placeholder-violet-600 focus:ring-0"
            type="text"
            id="taskInput"
            name="taskInput"
            placeholder="Enter your task"
          />
        </label>
        <button className=" bg-violet-600  mt-2 md:mt-0 sm:ml-2  px-5  py-2 text-md  lg:text-lg   text-white  font-medium  rounded  active:bg-violet-400  active:text-gray-500">
          Add Task
        </button>
      </div>
    </>
  );
};

export default TaskInput;
