import { Link } from "react-router";

const routes = [
  { path: "/", label: "Home" },
  { path: "/pricing", label: "Pricing" },
  { path: "/preloading-inspiration", label: "Preloading" },
];

const PageNav: React.FC = () => {
  return (
    <nav>
      <ul>
        {routes.map((route) => (
          <li key={route.path}>
            <Link to={route.path}>{route.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export { PageNav };
