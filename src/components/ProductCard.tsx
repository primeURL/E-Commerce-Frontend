import { FaExpandAlt, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartItem } from "../types/types";
import { transformImage } from "../utils/Features";

type ProductsProps = {
  productId: string;
  photos: {
    url: string;
    public_id: string;
  }[];
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};

const ProductCard = ({
  productId,
  price,
  name,
  photos,
  stock,
  handler,
}: ProductsProps) => {
  return (
    <div className="product-card">
      <img src={transformImage(photos?.[0]?.url, 400)} alt={name} />
      <p>{name}</p>
      <span>₹{price}</span>
        {
          stock === 0 ? <p style={{color:'red'}}>Out of Stock</p> : (stock < 5 ? <p style={{color:'coral'}}>Only {stock} left</p> : <p style={{color:'green'}}>{stock} in stock</p>)
        }
      <div>
        <button
          onClick={() =>
            handler({
              productId,
              price,
              name,
              photo: photos[0].url,
              stock,
              quantity: 1,
            })
          }
        >
          <FaPlus />
        </button>

        <Link to={`/product/${productId}`}>
          <FaExpandAlt />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;