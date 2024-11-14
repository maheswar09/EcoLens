import React, { createContext, useContext, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase.config";

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
        votes: {
          upvotes: 0,
          downvotes: 0,
        },
      });

      fetchReviews(productId);
    } catch (error) {
      console.error("Error adding review: ", error);
    }
  };

  const upvoteReview = async (reviewId, productId) => {
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      const reviewSnap = await getDoc(reviewRef);
      const currentVotes = reviewSnap.data().votes || {
        upvotes: 0,
        downvotes: 0,
      };

      await updateDoc(reviewRef, {
        votes: {
          upvotes: currentVotes.upvotes + 1,
          downvotes: currentVotes.downvotes,
        },
      });

      fetchReviews(productId);
    } catch (error) {
      console.error("Error upvoting review: ", error);
    }
  };

  const downvoteReview = async (reviewId, productId) => {
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      const reviewSnap = await getDoc(reviewRef);
      const currentVotes = reviewSnap.data().votes || {
        upvotes: 0,
        downvotes: 0,
      };

      await updateDoc(reviewRef, {
        votes: {
          upvotes: currentVotes.upvotes,
          downvotes: currentVotes.downvotes + 1,
        },
      });

      fetchReviews(productId);
    } catch (error) {
      console.error("Error downvoting review: ", error);
    }
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviewsDB,
        loading,
        fetchReviews,
        addReview,
        upvoteReview,
        downvoteReview,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};
