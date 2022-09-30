import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { addToCart } from "../features/cartSlice";
import { Link } from "react-router-dom";

const Home = () => {
  const { items: data, status } = useSelector((state) => state.products);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { data, error, isLoading } = useGetAllProductsQuery();

  const handleAddToCart = (products) => {
    dispatch(addToCart(products));
    navigate("/cart");
  };

  return (
    <div className="home-container">
      {status === "success" ? (
        <>
          <h2>New Arrivals</h2>
          <div className="products">
            {data &&
              data?.map((products) => (
                <div key={products._id} className="product">
                  <h3>{products.name}</h3>
                  <Link to={`/product/${products._id}`}>
                    <img src={products.image.url} alt={products.name} />
                  </Link>
                  <div className="details">
                    <span>{products.desc}</span>
                    <span className="price">${products.price}</span>
                  </div>
                  <button onClick={() => handleAddToCart(products)}>
                    Add To Cart
                  </button>
                </div>
              ))}
          </div>
        </>
      ) : status === "pending" ? (
        <p>Loading...</p>
      ) : (
        <p>Unexpected error occured...</p>
      )}
    </div>
  );
};

export default Home;
