import React, { createContext, useContext, useState } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../app/firebase";

const ReviewsContext = createContext();

export const useReviews = () => {
  return useContext(ReviewsContext);
};

export const ReviewsProvider = ({ children }) => {
  const [reviewsDB, setReviewsDB] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchReviews = async (productId) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "reviews"),
        where("productId", "==", productId)
      );
      const querySnapshot = await getDocs(q);
      const reviewsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReviewsDB((prev) => ({
        ...prev,
        [productId]: reviewsList,
      }));
    } catch (error) {
      console.error("Error fetching reviews: ", error);
    }
    setLoading(false);
  };

  const addReview = async (productId, reviewData) => {
    try {
      await addDoc(collection(db, "reviews"), {
        productId,
        date: new Date(),
        name: reviewData.name,
        rating: reviewData.rating,
        text: reviewData.text,
      });

      fetchReviews(productId);
    } catch (error) {
      console.error("Error adding review: ", error);
    }
  };

  return (
    <ReviewsContext.Provider value={{ reviewsDB, fetchReviews, addReview }}>
      {children}
    </ReviewsContext.Provider>
  );
};
