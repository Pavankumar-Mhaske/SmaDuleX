/**
 *
 * @param popup - To make rendering desicion (State).
 * @param todoId - TodoID is used to populate tasks by fetching them from DB.
 * @param makeRequest - State use to run the fetch tasks when todos are added deleted or updated in DB.
 * @param created - It is used to populate the todo created date and time.
 * @param updated - It is used to populate the todo updated date and time.
 * @returns
 */

const TodoModal = () => {
  <>
    <div
      className="
        w-[95%]
        border-2 
        hover:border-violet-400 
        p-2 
        rounded
        text-sm
        sm:text-md
        md:text-lg
        xl:text-xl 
        text-violet-800 
        font-medium
        m-auto
        max-h-24
        md:max-h-44
        overflow-auto
        my-4  
    "
    >
      <div>
        <p>No Tasks Available</p>
      </div>
      <div className="flex justify-between text-base mt-4">
        <p>
          Created:
          {new Date(created).toLocaleString("en-GB", {
            timeZone: "Asia/Kolkata",
          })}
        </p>

        <p>
          Updated:
          {new Date(updated).toLocaleString("en-GB", {
            timeZone: "Asia/Kolkata",
          })}
        </p>
      </div>
    </div>
  </>;
};

export default TodoModal;
