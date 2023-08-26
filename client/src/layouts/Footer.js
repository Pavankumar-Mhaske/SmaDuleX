const Footer = () => {
  return (
    <footer>
      <nav className="flex py-3 border-t-2 text-violet-800">
        <span className="text-md lg:text-xl font-medium ml-6">
          Flaticon authors
        </span>
        <ul className="w-[75%] flex flex-wrap justify-end">
          <li className="text-sm lg:text-xl mr-3 lg:mr-20 font-medium">
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.flaticon.com/authors/"
              title="star icons"
            >
              first
            </a>
          </li>
          <li className="text-sm lg:text-xl mr-3 lg:mr-20 font-medium">
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.flaticon.com/authors/"
              title="goal icons"
            >
              second
            </a>
          </li>
          <li className="text-sm lg:text-xl mr-3 lg:mr-20 font-medium">
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.flaticon.com/authors/"
              title="thired"
            >
              {" "}
              thired{" "}
            </a>
          </li>
          <li className="text-sm lg:text-xl mr-3 lg:mr-20 font-medium">
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.flaticon.com/authors/"
              title="search icons"
            >
              fourth
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
