import { auth, db } from "../firebase.config";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export const handleAddToWishlist = async (product, navigation) => {
  if (!auth.currentUser) {
    return { success: false, message: "login_required" };
  }

  try {
    const userId = auth.currentUser.uid;
    const wishlistRef = collection(db, "wishlists");

    const productId = product._id || product.product._id;

    if (!productId) {
      console.error("Error: Product ID is undefined", product);
      return { success: false, message: "Invalid product data" };
    }

    const q = query(
      wishlistRef,
      where("userId", "==", userId),
      where("_id", "==", productId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const productToAdd = product._id ? product : product.product;
      await addDoc(wishlistRef, {
        userId: userId,
        ...productToAdd,
        addedToWishlistAt: new Date(),
      });
      return { success: true, message: "Product added to wishlist!" };
    } else {
      return {
        success: false,
        message: "This product is already in your wishlist.",
      };
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return {
      success: false,
      message: "Failed to add product to wishlist. Please try again.",
    };
  }
};
