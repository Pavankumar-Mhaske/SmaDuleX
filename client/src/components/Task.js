// Importing the images
import bin from "../assets/icons/delete.png";

/**
 *
 * @param body - Task Body.
 * @param tasks - Array (State).
 * @param setTasks - function (Update State). To handle delete task operation
 * @returns Task Element.
 */

const Task = ({ body, tasks, setTasks }) => {
  /**
   * deleteTask() - It deletes the task from tasks array.
   *              - Finds the task index and splices the array.
   *              - Sets the updated array object to tasks.
   */
  // console.log("outside body:", body);
  const deleteTask = () => {
    /** 
    * const array = tasks
    * const index = array.indexOf(body)

    * 
    but we use below code:
    Because - The below code allows you to define a custom condition based on the body property of each task, 
      enabling more versatile and specific searching within the array.
    */
    // console.log("body:", body);
    // task.body === body
    const index = tasks.findIndex((task) => task === body);

    console.log("index:", index);
    /**
     * 
     *  array.splice(index, 1);
        setTasks([...array])

    but we use below code:
    because - it makes the intent clear and reduces the risk of introducing unintentional bugs related to 
      modifying the original array.

     */
    const array = [...tasks];
    // console.log(" before the splice array:", array);
    array.splice(index, 1);

    // console.log("after the splice array:", array);
    setTasks(array);
    // console.log("tasks:", tasks);
  };

  return (
    <div className="inline-block m-2 flex max-w-[91%]">
      <p
        className="
            p-1 
            max-w-[80%]
            md:max-w-[90%]
            break-words
            border 
            border-t-violet-500 
            border-b-violet-500 
            border-l-violet-500 
            border-r-transparent 
            rounded-l 
            p-0.5 
            bg-violet-100"
      >
        {body}
      </p>

      <button
        className="border border-red-500 rounded-r p-0.5 active:bg-red-200 pl-2 pr-1"
        onClick={deleteTask}
        type="button"
      >
        <img
          className="inline-block mb-1"
          src={bin}
          alt="Delete icon"
          width="16"
        />
      </button>
    </div>
  );
};

export default Task;
