import { useDispatch } from "react-redux";
import { useNavigate } from "react-router"
import { addToCart } from "../features/cartSlice";
import { useGetAllProductsQuery } from "../features/productsApi";

const Home = () => {
  const{data, error, isLoading} = useGetAllProductsQuery();
  const dispatch = useDispatch();
  const history = useNavigate();
  const handdleAddToCart = (products) =>{
    dispatch(addToCart(products));
    history('/cart');
  };

  return (
    <div className="home-container">
      { isLoading ? (<p>Loading...</p> ) : 
      error ? (<p>An error ocurred</p>) : 
     ( <>
        <h2>New Arrivals</h2>
        <div className="products">
          {data?.map(products => <div key={products.id} className="product">
            <h3>{products.name}</h3>
            <img src={products.image} alt={products.name} />
            <div className="details">
              <span>{products.desc}</span>
              <span className="price">{products.price}</span>
            </div>
            <button onClick={()=> handdleAddToCart(products)}>Add To Cart</button>
          </div>)}
        </div>
      </> 
      )}
    </div>
  );
};
 
export default Home;