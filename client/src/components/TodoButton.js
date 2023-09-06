/**
 * @param name - String, Used to receive a value of button (Button Text) .
 * @returns A Button element to submit the data in  form.
 */
import "../pages/styles/customStyles.css";

const TodoButton = ({ name = "Todo Button", passwordMatched = true }) => {
  return (
    <button
      className={`todobutton_in_form mt-2 rounded w-full px-6 py-2 font-semibold ${
        // if passwordMatched is true then button will be green
        // if passwordMatched is false then button will be gray
        passwordMatched
          ? "border-green-500 text-green-500 active:bg-green-300 active:text-gray-600"
          : "border-gray-400 text-gray-400 cursor-not-allowed"
      } text-lg`}
      disabled={!passwordMatched} // button will activate only if passwordMatched is true
    >
      {name}
    </button>
  );
};

export default TodoButton;
